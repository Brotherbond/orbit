"use client"

import { useRoles } from "@/components/dashboard/RolesContext"
import UserForm from "@/components/dashboard/UserForm"
import { toast } from "@/hooks/use-toast"
import { catchError } from "@/lib/utils"
import { useUpdateIMEVSSMutation } from "@/store/ime-vss"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import * as Yup from "yup"
import { useImeVssContext } from "../ime-vss-context"

export default function EditImeVssPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    market_id: "",
    role_id: "",
    status: "active",
  })
  const { roles, isLoading: isRolesLoading } = useRoles()
  const { imeVss, fetchImeVss } = useImeVssContext()
  const router = useRouter()
  const [updateIMEVSS] = useUpdateIMEVSSMutation()

  useEffect(() => {
    if (imeVss && roles.length > 0) {
      setInitialValues({
        first_name: imeVss.first_name,
        last_name: imeVss.last_name,
        email: imeVss.email,
        phone: imeVss.phone,
        market_id: imeVss.market?.uuid || "",
        role_id: imeVss.role?.uuid || "",
        status: imeVss.status,
      })
    }
  }, [imeVss, roles])

  if (!imeVss) { return null; }

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
        .filter((role) => ["vss", "ime"].includes(role.name.toLowerCase()))
        .map((role) => ({
          label: role.name,
          value: role.uuid,
        })),
    },
    {
      name: "market_id",
      label: "Market",
      type: "selectWithFetch" as const,
      required: false,
      placeholder: "Select market",
      fetchUrl: "/markets",
      valueKey: "uuid",
      labelKey: "name",
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
    try {
      await updateIMEVSS({ id: params.id, data: values }).unwrap()
      toast({
        title: "Success",
        description: "IME-VSS updated successfully",
      })
      fetchImeVss()
      router.push(`/dashboard/ime-vss/${params.id}`)
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <UserForm
      title="IME-VSS Information"
      description="Update the IME-VSS details below"
      initialValues={initialValues}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={false}
      onSubmit={handleSubmit}
      submitLabel="Update IME-VSS"
      onCancel={() => router.back()}
    />
  )
}
