"use client"

import UserForm from "@/components/dashboard/UserForm";
import { toast } from "@/hooks/use-toast";
import { useUpdateDistributorMutation } from "@/store/distributors";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import * as Yup from "yup";
import { useDistributor } from "../distributor-context";
import { catchError } from "@/lib/utils";

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
    const { distributor, updateDistributor } = useDistributor()
  const [updateDistributorMutation] = useUpdateDistributorMutation()

  const initialValues = useMemo<Distributor>(() => {
    if (!distributor) {
      return {
        first_name: "",
        last_name: "",
        category: "",
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
      category: distributor.category || "",
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
    category: Yup.string().required("Category is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    ime_vss_user_id: Yup.string().required("IME VSS User is required"),
    send_notification: Yup.boolean(),
  }), [])

  const handleSubmit = useCallback(async (values: Distributor, { setSubmitting, setFieldError }: any) => {
    try {
      await updateDistributorMutation({ id: params.id, data: values }).unwrap();
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
      });
      toast({
        title: "Success",
        description: "Distributor updated successfully",
      });
      router.push(`/dashboard/distributors/${params.id}`);
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  }, [params.id, distributor, updateDistributor, toast, router, updateDistributorMutation])

  const fields = useMemo(() => [
    {
      name: "business_name",
      label: "Business Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter business name",
    },
    {
      name: "category",
      label: "Category",
      type: "text" as const,
      required: true,
      placeholder: "Enter category",
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



  return (
    <div>
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
