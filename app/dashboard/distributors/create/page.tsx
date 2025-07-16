"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import * as Yup from "yup"
import UserForm from "@/components/dashboard/UserForm"
import { userFullNameEmailFormatter } from "@/lib/label-formatters"

export default function CreateDistributorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    business_name: "",
    address: "",
    ime_vss_user_id: "",
    send_notification: false,
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    password: Yup.string().required("Password is required"),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    ime_vss_user_id: Yup.string().required("IME VSS User is required"),
    send_notification: Yup.boolean(),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError, resetForm }: any) => {
    setIsLoading(true)
    try {
      const { data, status } = await apiClient.post("/distributors", values)
      if (status === "success") {
        toast({
          title: "Success",
          description: "Distributor created successfully",
        });
        resetForm();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create distributor",
        variant: "destructive",
      })
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message as string)
        })
      }
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  const fields = [
    {
      name: "business_name",
      label: "Business Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter business name",
    },
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
      label: "Email",
      type: "email" as const,
      required: true,
      placeholder: "Enter email",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text" as const,
      required: false,
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
      name: "ime_vss_user_id",
      label: "Assign IME/VSS Team",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/users?roles=ime,vss",
      valueKey: "uuid",
      labelFormatter: userFullNameEmailFormatter,
      placeholder: "Select IME/VSS user",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea" as const,
      required: true,
      placeholder: "Enter address",
      rows: 3,
    },
    {
      name: "send_notification",
      label: "Send Notification",
      type: "switch" as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="btn btn-ghost flex items-center"
          onClick={() => router.back()}
        >
          <span className="mr-2">
            ←
          </span>
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Create Distributor</h1>
          <p className="text-[#ababab]">Add a new distributor to the system</p>
        </div>
      </div>
      <UserForm
        title="Distributor Information"
        description="Enter the details for the new distributor"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Create Distributor"
        onCancel={() => router.back()}
        cardClassName="max-w-4xl"
      />
    </div>
  )
}
