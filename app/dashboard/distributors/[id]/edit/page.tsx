"use client"

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import * as Yup from "yup";
import UserForm from "@/components/dashboard/UserForm";
import { useDistributor } from "../distributor-context";

interface Distributor {
  first_name: string
  last_name: string
  email: string
  phone: string
  business_name: string
  address: string
  ime_vss_user_id: string
  send_notification: boolean
}

export default function EditDistributorPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { distributor, isLoading: isDataLoading, error, updateDistributor } = useDistributor()

  const initialValues = useMemo<Distributor>(() => {
    if (!distributor) {
      return {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        business_name: "",
        address: "",
        ime_vss_user_id: "",
        send_notification: false,
      }
    }

    return {
      first_name: distributor.user?.first_name || "",
      last_name: distributor.user?.last_name || "",
      email: distributor.user?.email || "",
      phone: distributor.user?.phone || "",
      business_name: distributor.business_name || "",
      address: distributor.address || "",
      ime_vss_user_id: distributor.ime_vss?.uuid || "",
      send_notification: false,
    }
  }, [distributor])

  const validationSchema = useMemo(() => Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    ime_vss_user_id: Yup.string().required("IME VSS User is required"),
    send_notification: Yup.boolean(),
  }), [])

  const handleSubmit = useCallback(async (values: Distributor, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const { data, status } = await apiClient.put(`/distributors/${params.id}`, values)
      if (status === "success") {
        // Update the context with new data
        updateDistributor({
          business_name: values.business_name,
          address: values.address,
          user: {
            ...distributor?.user!,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: values.phone,
          },
          ime_vss: distributor?.ime_vss
        })

        toast({
          title: "Success",
          description: "Distributor updated successfully",
        })
        router.push(`/dashboard/distributors/${params.id}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update distributor",
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
  }, [params.id, distributor, updateDistributor, toast, router])

  const fields = useMemo(() => [
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
      name: "ime_vss_user_id",
      label: "Assign IME/VSS Team",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/users?roles=ime,vss",
      valueKey: "uuid",
      labelKey: "email",
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
  ], [])

  if (isDataLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !distributor) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">{error || "Distributor not found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <UserForm
        title="Distributor Information"
        description="Update the distributor details below"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Update Distributor"
        onCancel={() => router.back()}
        cardClassName="max-w-4xl"
      />
    </div>
  )
}
