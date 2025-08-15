"use client";
import { useState } from "react";
import { useRoles } from "@/components/dashboard/RolesContext";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import * as Yup from "yup";
import UserForm from "@/components/dashboard/UserForm";

export default function CreateUserPage() {
  const { roles, isLoading: isRolesLoading } = useRoles()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: "",
    send_notification: false,
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role_id: Yup.string().required("Role is required"),
    send_notification: Yup.boolean(),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError, resetForm }: any) => {
    setIsLoading(true)
    try {
      await apiClient.post("/users", values)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      })
      setFieldError("email", error.response?.data?.errors?.email || "")
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

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
      name: "password",
      label: "Password",
      type: "password" as const,
      required: true,
      placeholder: "Enter password",
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
      name: "send_notification",
      label: "Send welcome notification",
      type: "switch" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Create User" description="Add a new user to the system" />
      <UserForm
        title="User Information"
        description="Enter the details for the new user"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading || isRolesLoading}
        onSubmit={handleSubmit}
        submitLabel="Create User"
        onCancel={() => router.back()}
      />
    </div>
  )
}
