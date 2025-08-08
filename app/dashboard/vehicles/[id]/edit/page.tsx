"use client"


import { useVehicleContext } from "../vehicle-context"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

import type { Vehicle } from "@/types/vehicle"
import { VehicleForm } from "@/components/dashboard/VehicleForm"

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const { vehicle, isLoading, fetchVehicle } = useVehicleContext();
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const validationSchema = Yup.object({
    type: Yup.string().required("Type is required"),
    fuel_per_km: Yup.number().required("Fuel per km is required"),
    height: Yup.number().required("Height is required"),
    length: Yup.number().required("Length is required"),
    width: Yup.number().required("Width is required"),
    max_weight: Yup.number().required("Max weight is required"),
  });

  const handleSubmit = async (values: Vehicle, { setSubmitting, setFieldError }: any) => {
    try {
      const payload = {
        type: values.type,
        fuel_per_km: values.fuel_per_km,
        height: values.height,
        length: values.length,
        width: values.width,
        max_weight: values.max_weight,
      };
      const response = await apiClient.put<any>(`/vehicles/${params.id}`, payload);
      if (response.status === "success") {
        toast({ title: "Success", description: "Vehicle updated successfully" });
        fetchVehicle();
        router.push(`/dashboard/vehicles/${params.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update vehicle",
        variant: "destructive",
      });
      setFieldError("type", error.response?.data?.errors?.type || "");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "type", label: "Vehicle Type", type: "text" as const, required: true, placeholder: "Vehicle Type" },
    { name: "fuel_per_km", label: "Fuel per Km (L)", type: "text" as const, required: true, placeholder: "Fuel per Km" },
    { name: "height", label: "Height (m)", type: "text" as const, required: true, placeholder: "Height" },
    { name: "length", label: "Length (m)", type: "text" as const, required: true, placeholder: "Length" },
    { name: "width", label: "Width (m)", type: "text" as const, required: true, placeholder: "Width" },
    { name: "max_weight", label: "Max Weight (kg)", type: "text" as const, required: true, placeholder: "Max Weight" },
  ];

  return (
    <VehicleForm
      title="Update Vehicle"
      description="Edit vehicle information below"
      initialValues={vehicle as Vehicle}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Update Vehicle"
      onCancel={() => router.back()}
      cardClassName="max-w-2xl"
    />
  )
}
