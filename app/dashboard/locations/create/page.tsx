"use client"

import { LocationForm } from "@/components/dashboard/LocationForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useCreateLocationMutation } from "@/store/locations";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function CreateLocationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createLocation, { isLoading }] = useCreateLocationMutation();

  const initialValues = {
    street: "",
    city: "",
    state: "",
    region: "",
    country: "",
    latitude: "",
    longitude: "",
  }

  const validationSchema = Yup.object({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    region: Yup.string().required("Region is required"),
    country: Yup.string().required("Country is required"),
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .nullable()
      .transform((value, originalValue) => originalValue === "" ? null : value),
  })

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    try {
      await createLocation(values).unwrap();
      toast({
        title: "Success",
        description: "Location created successfully",
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
      <ViewPageHeader title="Create Location" />
      <LocationForm
        title="Location Information"
        description="Add a new location to the system"
        initialValues={initialValues}
        validationSchema={validationSchema}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Create Location"
        onCancel={() => router.back()}
      />
    </>
  );
}
