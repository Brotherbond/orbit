"use client"

import { DeliveryForm } from "@/components/dashboard/DeliveryForm"
import { useToast } from "@/hooks/use-toast"
import { useCreateDeliveryMutation } from "@/store/deliveries"
import { useRouter } from "next/navigation"
import * as Yup from "yup"

export default function CreateDeliveryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation()

  const initialValues = {
    order_id: "",
    vehicle_id: "",
    distance: "",
    cost_ratio: "",
    delivery_burn_rate: "",
    from_id: "",
    to_id: "",
    total_order_volume: "",
    total_order_weight: "",
    vehicle_max_density: "",
    vehicle_coverage: "",
  }

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Order is required"),
    vehicle_id: Yup.string().required("Vehicle is required"),
    distance: Yup.string().required("Distance is required"),
    cost_ratio: Yup.string().required("Cost Ratio is required"),
    delivery_burn_rate: Yup.string().required("Burn Rate is required"),
    from_id: Yup.string().required("From location is required"),
    to_id: Yup.string().required("To location is required"),
    total_order_volume: Yup.string().required("Order Volume is required"),
    total_order_weight: Yup.string().required("Order Weight is required"),
    vehicle_max_density: Yup.string().required("Vehicle Max Density is required"),
    vehicle_coverage: Yup.string().required("Vehicle Coverage is required"),
  })

  const fields = [
    {
      name: "order_id",
      label: "Order",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/orders",
      valueKey: "uuid",
      labelKey: "ref",
      placeholder: "Select order",
    },
    {
      name: "vehicle_id",
      label: "Vehicle",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/vehicles",
      valueKey: "uuid",
      labelKey: "type",
      placeholder: "Select vehicle",
    },
    {
      name: "from_id",
      label: "From Location",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/locations",
      valueKey: "uuid",
      labelKey: "full_location",
      placeholder: "Select from location",
    },
    {
      name: "to_id",
      label: "To Location",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/locations",
      valueKey: "uuid",
      labelKey: "full_location",
      placeholder: "Select to location",
    },
    { name: "distance", label: "Distance (km)", type: "text" as const, required: true, placeholder: "Distance" },
    { name: "cost_ratio", label: "Cost Ratio", type: "text" as const, required: true, placeholder: "Cost Ratio" },
    { name: "delivery_burn_rate", label: "Burn Rate", type: "text" as const, required: true, placeholder: "Burn Rate" },
    { name: "total_order_volume", label: "Order Volume (m³)", type: "text" as const, required: true, placeholder: "Order Volume" },
    { name: "total_order_weight", label: "Order Weight (kg)", type: "text" as const, required: true, placeholder: "Order Weight" },
    { name: "vehicle_max_density", label: "Vehicle Max Density (kg/m³)", type: "text" as const, required: true, placeholder: "Vehicle Max Density" },
    { name: "vehicle_coverage", label: "Vehicle Coverage (km)", type: "text" as const, required: true, placeholder: "Vehicle Coverage" },
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      ...values,
      distance: Number(values.distance),
      cost_ratio: Number(values.cost_ratio),
      delivery_burn_rate: Number(values.delivery_burn_rate),
      total_order_volume: Number(values.total_order_volume),
      total_order_weight: Number(values.total_order_weight),
      vehicle_max_density: Number(values.vehicle_max_density),
      vehicle_coverage: Number(values.vehicle_coverage),
    }
    try {
      await createDelivery(payload).unwrap()
      toast({
        title: "Success",
        description: "Delivery created successfully",
      })
      helpers.resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create delivery",
        variant: "destructive",
      })
    }
    helpers.setSubmitting(false)
  }

  return (
    <DeliveryForm
      title="Create Delivery"
      description="Add a new delivery to the system"
      initialValues={initialValues}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isCreating}
      onSubmit={handleSubmit}
      submitLabel="Create Delivery"
      onCancel={() => router.back()}
    />
  )
}
