"use client"

import RoleForm, { RoleFormValues } from "@/components/dashboard/RoleForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useRouter } from "next/navigation";
import { useRoleContext } from "../role-context";

export default function EditRolePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { role, isLoading } = useRoleContext();

  const initialValues: RoleFormValues = {
    name: role?.name || "",
    description: role?.description || "",
    status: role?.status || "active",
    access_type: role?.access_type || "web",
    permissions: role?.permissions?.map((p: any) => p.uuid || p.id) || [],
  };

  if (isLoading) {
    return <div className="p-8">Loading role data...</div>;
  }

  return (
    <>
      <ViewPageHeader
        title="Edit Role"
        description="Update role information"
      />
      <RoleForm
        initialValues={initialValues}
        isEdit={true}
        roleId={params.id}
        title="Edit Role"
        description="Update role information"
        submitButtonText="Update Role"
      />
    </>
  );
}
