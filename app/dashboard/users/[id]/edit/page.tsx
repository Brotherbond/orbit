"use client"

import { useRoles } from "@/components/dashboard/RolesContext";
import UserForm from "@/components/dashboard/UserForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useUpdateUserMutation } from "@/store/users";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useUserContext } from "../user-context";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { roles, isLoading: isRolesLoading } = useRoles()
  const router = useRouter()
  const { toast } = useToast()
  const [updateUser] = useUpdateUserMutation()
  const { user, isLoading, fetchUser } = useUserContext();

  const initialValues = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role_id: user?.role?.uuid || "",
    status: user?.status || "active",
  };

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
        .map((role) => ({ label: role.name, value: role.uuid })),
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
      await updateUser({ id: params.id, data: values }).unwrap();
      toast({ title: "Success", description: "User updated successfully" });
      fetchUser();
      router.push(`/dashboard/users/${params.id}`);
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ViewPageHeader title="Update User" description="Edit user information below" />
      <UserForm
        title="Update User"
        description="Edit user information below"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading || isRolesLoading}
        onSubmit={handleSubmit}
        submitLabel="Update User"
        onCancel={() => router.back()}
      />
    </div>
  )
}
