"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Calendar, Laptop, Smartphone } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Role } from "@/types/role"

export default function RoleDetailPage({ params }: { params: { id: string } }) {
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => { fetchRole() }, [params.id])

  const fetchRole = async () => {
    try {
      setIsLoading(true)
      const { data } = await apiClient.get<{ item: Role }>(`/roles/${params.id}`)
      setRole(data.item ?? null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch role details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      await apiClient.delete(`/roles/${params.id}`)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      router.push("/dashboard/roles")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Role not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#444444]">
              {role.name}
            </h1>
            <p className="text-[#ababab]">Role Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/roles/${role.uuid}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-[#ababab]">Description</span>
              <div className="font-medium text-[#444444]">{role.description}</div>
            </div>

            <div className="space-y-2">
              <span className="text-[#ababab]">Status</span>
              <div>
                <Badge variant={role.status === "active" ? "primary" : "destructive"}>
                  {role.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[#ababab]">Access Type</span>
              <div className="flex items-center space-x-2">
                {role.access_type === "web" ? (
                  <>
                    <Laptop className="h-4 w-4 text-[#444444]" />
                    <span className="font-medium text-[#444444]">Web</span>
                  </>
                ) : role.access_type === "mobile" ? (
                  <>
                    <Smartphone className="h-4 w-4 text-[#444444]" />
                    <span className="font-medium text-[#444444]">Mobile</span>
                  </>
                ) : (
                  <span className="font-medium text-[#444444]">{role.access_type || "N/A"}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created</p>
                <p className="font-medium text-[#444444]">{role.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
