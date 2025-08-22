"use client";

import RoleForm, { RoleFormValues } from "@/components/dashboard/RoleForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { catchError } from "@/lib/utils";
import { useCreateRoleMutation } from "@/store/roles";
import { useRouter } from "next/navigation";

export default function CreateRolePage() {
  const router = useRouter()
  const [createRole, { isLoading }] = useCreateRoleMutation()

  const initialValues: RoleFormValues = {
    name: "",
    description: "",
    status: "active",
    access_type: "web",
    permissions: [],
  }

  const handleSubmit = async (values: RoleFormValues, helpers: any) => {
    try {
      await createRole(values).unwrap()
      helpers.resetForm()
      router.push("/dashboard/roles")
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <>
      <ViewPageHeader title="Create Role" />
      <RoleForm
        initialValues={initialValues}
        isEdit={false}
        onSubmit={handleSubmit}
        loading={isLoading}
        title="Role Information"
        description="Add a new role to the system"
        submitButtonText="Create Role"
      />
    </>
  )
}
