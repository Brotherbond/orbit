"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, ErrorMessage } from "formik"
import { useCreateVehicleMutation } from "@/store/vehicles"

import { VehicleForm } from "@/components/dashboard/VehicleForm"

export default function CreateVehiclePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation()

  const initialValues = {
    type: "",
    fuel_per_km: "",
    height: "",
    length: "",
    width: "",
    max_weight: "",
  }

  const validationSchema = Yup.object({
    type: Yup.string().required("Vehicle type is required"),
    fuel_per_km: Yup.string().required("Fuel per Km is required"),
    height: Yup.string().required("Height is required"),
    length: Yup.string().required("Length is required"),
    width: Yup.string().required("Width is required"),
    max_weight: Yup.string().required("Max Weight is required"),
  })

  const fields = [
    { name: "type", label: "Vehicle Type", type: "text" as const, required: true, placeholder: "Vehicle Type" },
    { name: "fuel_per_km", label: "Fuel per Km (L)", type: "text" as const, required: true, placeholder: "Fuel per Km" },
    { name: "height", label: "Height (m)", type: "text" as const, required: true, placeholder: "Height" },
    { name: "length", label: "Length (m)", type: "text" as const, required: true, placeholder: "Length" },
    { name: "width", label: "Width (m)", type: "text" as const, required: true, placeholder: "Width" },
    { name: "max_weight", label: "Max Weight (kg)", type: "text" as const, required: true, placeholder: "Max Weight" },
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      ...values,
      fuel_per_km: Number(values.fuel_per_km),
      height: Number(values.height),
      length: Number(values.length),
      width: Number(values.width),
      max_weight: Number(values.max_weight),
    }
    try {
      await createVehicle(payload).unwrap()
      toast({
        title: "Success",
        description: "Vehicle created successfully",
      })
    helpers.resetForm()
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.message || "Failed to create vehicle",
      variant: "destructive",
    })
  }
  helpers.setSubmitting(false)
  }

  return (
    <VehicleForm
      title="Create Vehicle"
      description="Add a new vehicle to the system"
      initialValues={initialValues}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isCreating}
      onSubmit={handleSubmit}
      submitLabel="Create Vehicle"
      onCancel={() => router.back()}
    />
  )
}
