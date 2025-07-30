"use client"

import { useRouter } from "next/navigation"
import RoleForm, { RoleFormValues } from "@/components/dashboard/RoleForm"

export default function CreateRolePage() {
  const initialValues: RoleFormValues = {
    name: "",
    description: "",
    status: "active",
    access_type: "web",
    permissions: [],
  }

  return (
    <RoleForm
      initialValues={initialValues}
      isEdit={false}
      title="Create Role"
      description="Add a new role to the system"
      submitButtonText="Create Role"
    />
  )
}
