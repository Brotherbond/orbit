"use client";
import { LocationForm } from "@/components/dashboard/LocationForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useUpdateLocationMutation } from "@/store/locations";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useLocationContext } from "../location-context";

interface LocationData {
  street: string
  city: string
  state: string
  region: string
  country: string
  latitude: number | string
  longitude: number | string
}


export default function EditLocationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [updateLocation] = useUpdateLocationMutation();
  const { location, isLoading } = useLocationContext();

  const initialValues: LocationData = {
    street: location?.street || "",
    city: location?.city || "",
    state: location?.state || "",
    region: location?.region || "",
    country: location?.country || "",
    latitude: location?.latitude || "",
    longitude: location?.longitude || "",
  };

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

  const handleSubmit = async (values: LocationData, helpers: any) => {
    try {
      await updateLocation({ id: params.id, data: values }).unwrap();
      toast({
        title: "Success",
        description: "Location updated successfully",
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
      <ViewPageHeader title="Edit Location" />
      <LocationForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Update Location"
        title="Edit Location"
        description="Update location information"
        onCancel={() => router.back()}
      />
    </>
  );
}
