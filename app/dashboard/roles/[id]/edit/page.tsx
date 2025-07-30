"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import RoleForm, { RoleFormValues } from "@/components/dashboard/RoleForm"

export default function EditRolePage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<RoleFormValues>({
    name: "",
    description: "",
    status: "active",
    access_type: "web",
    permissions: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchRole()
    // eslint-disable-next-line
  }, [params.id])

  const fetchRole = async () => {
    try {
      const response = await apiClient.get<{ item: any }>(`/roles/${params.id}`)
      const role = response.data.item
      setInitialValues({
        name: role.name || "",
        description: role.description || "",
        status: role.status || "active",
        access_type: role.access_type || "web",
        permissions: role.permissions?.map((p: any) => p.uuid || p.id) || [],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch role data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading role data...</div>
  }

  return (
    <RoleForm
      initialValues={initialValues}
      isEdit={true}
      roleId={params.id}
      title="Edit Role"
      description="Update role information"
      submitButtonText="Update Role"
    />
  )
}
