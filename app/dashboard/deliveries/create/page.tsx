"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import * as Yup from "yup"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, ErrorMessage } from "formik"
import { useGetOrdersQuery } from "@/store/orders"
import { useGetVehiclesQuery } from "@/store/vehicles"
import { useCreateDeliveryMutation } from "@/store/deliveries"
import { SelectWithFetch } from "@/components/ui/select"

import { DeliveryForm } from "@/components/dashboard/DeliveryForm"

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
    total_order_volume: "",
    total_order_weight: "",
  }

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Order is required"),
    vehicle_id: Yup.string().required("Vehicle is required"),
    distance: Yup.string().required("Distance is required"),
    cost_ratio: Yup.string().required("Cost Ratio is required"),
    delivery_burn_rate: Yup.string().required("Burn Rate is required"),
    total_order_volume: Yup.string().required("Order Volume is required"),
    total_order_weight: Yup.string().required("Order Weight is required"),
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
    { name: "distance", label: "Distance (km)", type: "text" as const, required: true, placeholder: "Distance" },
    { name: "cost_ratio", label: "Cost Ratio", type: "text" as const, required: true, placeholder: "Cost Ratio" },
    { name: "delivery_burn_rate", label: "Burn Rate", type: "text" as const, required: true, placeholder: "Burn Rate" },
    { name: "total_order_volume", label: "Order Volume (m³)", type: "text" as const, required: true, placeholder: "Order Volume" },
    { name: "total_order_weight", label: "Order Weight (kg)", type: "text" as const, required: true, placeholder: "Order Weight" },
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      ...values,
      distance: Number(values.distance),
      cost_ratio: Number(values.cost_ratio),
      delivery_burn_rate: Number(values.delivery_burn_rate),
      total_order_volume: Number(values.total_order_volume),
      total_order_weight: Number(values.total_order_weight),
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
