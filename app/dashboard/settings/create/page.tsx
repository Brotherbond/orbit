"use client"

import { SettingForm } from "@/components/dashboard/SettingForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useCreateSettingMutation } from "@/store/settings";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function CreateSettingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [createSetting, { isLoading }] = useCreateSettingMutation()

  const initialValues = {
    key: "",
    value: "",
    description: "",
    status: "active",
  }

  const validationSchema = Yup.object({
    key: Yup.string().required("Key is required"),
    value: Yup.string().required("Value is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    try {
      await createSetting(values).unwrap()
      toast({
        title: "Success",
        description: "Setting created successfully",
      });
      helpers.resetForm();
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <>
      <ViewPageHeader title="Create Setting" />
      <SettingForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Create Setting"
        title="Create Setting"
        description="Add a new setting to the system"
        onCancel={() => router.back()}
      />
    </>
  )
}
