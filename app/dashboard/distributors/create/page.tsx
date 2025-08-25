"use client"

import UserForm from "@/components/dashboard/UserForm"
import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { toast } from "@/hooks/use-toast"
import { userFullNameEmailFormatter } from "@/lib/label-formatters"
import { catchError } from "@/lib/utils"
import { useCreateDistributorMutation } from "@/store/distributors"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import * as Yup from "yup"

export default function CreateDistributorPage() {
  const [createDistributor, { isLoading }] = useCreateDistributorMutation()
  const router = useRouter()
  const dispatch = useDispatch()

  const initialValues = {
    first_name: "",
    last_name: "",
    category: "",
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
    category: Yup.string().required("Category is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    password: Yup.string().required("Password is required"),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    ime_vss_user_id: Yup.string().required("IME VSS User is required"),
    send_notification: Yup.boolean(),
  })

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    try {
      await createDistributor(values).unwrap()
      toast({
        title: "Success",
        description: "Distributor created successfully",
      })
      helpers.resetForm()
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false)
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
    <div>
      <ViewPageHeader title="Create Distributor" description="Add a new distributor to the system" />
      <UserForm
        title="Create Distributor"
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
