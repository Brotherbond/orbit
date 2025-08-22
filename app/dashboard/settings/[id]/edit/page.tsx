"use client"

import { SettingForm } from "@/components/dashboard/SettingForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useUpdateSettingMutation } from "@/store/settings";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useSettingContext } from "../setting-context";

interface SettingData {
  key: string
  value: string
  description: string
  status: string
}

export default function EditSettingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [updateSetting] = useUpdateSettingMutation();
  const { setting, isLoading } = useSettingContext();

  const initialValues: SettingData = {
    key: setting?.key || "",
    value: setting?.value || "",
    description: setting?.description || "",
    status: setting?.status || "active",
  };

  const validationSchema = Yup.object({
    key: Yup.string().required("Key is required"),
    value: Yup.string().required("Value is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: SettingData, helpers: any) => {
    try {
      await updateSetting({ id: params.id, data: values }).unwrap();
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      helpers.resetForm();
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <ViewPageHeader
        title="Edit Setting"
        description="Update setting information"
      />
      <SettingForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Update Setting"
        title="Edit Setting"
        description="Update the setting details below"
        onCancel={() => router.back()}
      />
    </>
  );
}
