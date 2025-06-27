"use client"

import { useState, useEffect } from "react"
import { useRoles } from "@/components/dashboard/RolesContext"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import * as Yup from "yup"
import UserForm from "@/components/dashboard/UserForm"
import { User } from "@/types/user"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    status: "active",
  })
  const [userData, setUserData] = useState<User | null>(null)
  const { roles, isLoading: isRolesLoading } = useRoles()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get<{ item: User }>(`/users/${params.id}`)
      setUserData(data.item)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (userData && roles.length > 0) {
      setInitialValues({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        role_id: userData.role?.uuid || "",
        status: userData.status,
      })
    }
  }, [userData, roles])

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    market_id: Yup.string(),
    role_id: Yup.string().required("Role is required"),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter first name",
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter last name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email" as const,
      required: true,
      placeholder: "Enter email address",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text" as const,
      required: true,
      placeholder: "Enter phone number",
    },
    {
      name: "role_id",
      label: "Role",
      type: "select" as const,
      required: true,
      placeholder: "Select role",
      options: roles
        .filter((role) => !["vss", "ime", "distributor"].includes(role.name.toLowerCase()))
        .map((role) => ({
          label: role.name,
          value: role.uuid,
        })),
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      placeholder: "Select status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      await apiClient.put(`/users/${params.id}`, values)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
      router.push(`/dashboard/users/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      })
      setFieldError("email", error.response?.data?.errors?.email || "")
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="btn btn-ghost flex items-center"
          onClick={() => router.back()}
        >
          <span className="mr-2">←</span>
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Edit User</h1>
          <p className="text-[#ababab]">Update user information</p>
        </div>
      </div>
      <UserForm
        title="User Information"
        description="Update the user details below"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={false}
        onSubmit={handleSubmit}
        submitLabel="Update User"
        onCancel={() => router.back()}
      />
    </div>
  )
}
