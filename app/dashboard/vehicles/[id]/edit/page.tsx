"use client"

import { VehicleForm } from "@/components/dashboard/VehicleForm"
import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { toast } from "@/hooks/use-toast"
import { catchError } from "@/lib/utils"
import { useUpdateVehicleMutation } from "@/store/vehicles"
import type { Vehicle } from "@/types/vehicle"
import { useRouter } from "next/navigation"
import * as Yup from "yup"
import { useVehicleContext } from "../vehicle-context"

export default function EditVehiclePage() {
  const { vehicle, isLoading, fetchVehicle } = useVehicleContext();
  const router = useRouter()
  const [updateVehicle] = useUpdateVehicleMutation()

  if (!vehicle) { return null; }

  const validationSchema = Yup.object({
    vehicle_number: Yup.string().required("Vehicle number is required"),
    type: Yup.string().required("Type is required"),
    fuel_per_km: Yup.number().required("Fuel per km is required"),
    cost_supply_per_km: Yup.number().required("Cost supply per km is required"),
    height: Yup.number().required("Height is required"),
    length: Yup.number().required("Length is required"),
    width: Yup.number().required("Width is required"),
    max_weight: Yup.number().required("Max weight is required"),
  });

  const handleSubmit = async (values: Vehicle, { setSubmitting, setFieldError }: any) => {
    try {
      const data = {
        vehicle_number: values.vehicle_number,
        type: values.type,
        fuel_per_km: values.fuel_per_km,
        cost_supply_per_km: values.cost_supply_per_km,
        height: values.height,
        length: values.length,
        width: values.width,
        max_weight: values.max_weight,
      };
      await updateVehicle({ id: vehicle.uuid, data }).unwrap();
      toast({ title: "Success", description: "Vehicle updated successfully" });
      fetchVehicle();
      router.push(`/dashboard/vehicles/${vehicle.uuid}`);
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "vehicle_number", label: "Vehicle Number", type: "text" as const, required: true, placeholder: "Vehicle Number" },
    { name: "type", label: "Vehicle Type", type: "text" as const, required: true, placeholder: "Vehicle Type" },
    { name: "fuel_per_km", label: "Fuel per Km (L)", type: "text" as const, required: true, placeholder: "Fuel per Km" },
    { name: "cost_supply_per_km", label: "Cost Supply per Km", type: "text" as const, required: true, placeholder: "Cost Supply per Km" },
    { name: "height", label: "Height (m)", type: "text" as const, required: true, placeholder: "Height" },
    { name: "length", label: "Length (m)", type: "text" as const, required: true, placeholder: "Length" },
    { name: "width", label: "Width (m)", type: "text" as const, required: true, placeholder: "Width" },
    { name: "max_weight", label: "Max Weight (kg)", type: "text" as const, required: true, placeholder: "Max Weight" },
  ];

  return (
    <div>
      <ViewPageHeader title="Update Vehicle" description="Edit vehicle information below" />
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

    </div>
  )
}
