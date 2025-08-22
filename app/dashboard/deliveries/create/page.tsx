"use client"

import { DeliveryForm } from "@/components/dashboard/DeliveryForm"
import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { useToast } from "@/hooks/use-toast"
import { catchError } from "@/lib/utils"
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
    from: "",
    to: "",
  }

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Order is required"),
    vehicle_id: Yup.string().required("Vehicle is required"),
    distance: Yup.string().required("Distance is required"),
    // cost_ratio: Yup.string().required("Cost Ratio is required"),
    // delivery_burn_rate: Yup.string().required("Burn Rate is required"),
    from: Yup.string().required("From location is required"),
    to: Yup.string().required("To location is required"),
    // total_order_volume: Yup.string().required("Order Volume is required"),
    // total_order_weight: Yup.string().required("Order Weight is required"),
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
      name: "from",
      label: "From Location",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/locations",
      valueKey: "uuid",
      labelKey: "full_location",
      placeholder: "Select from location",
    },
    {
      name: "to",
      label: "To Location",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/locations",
      valueKey: "uuid",
      labelKey: "full_location",
      placeholder: "Select to location",
    },
    { name: "distance", label: "Distance (km)", type: "text" as const, required: true, placeholder: "Distance" },
    // { name: "cost_ratio", label: "Cost Ratio", type: "text" as const, required: true, placeholder: "Cost Ratio" },
    // { name: "delivery_burn_rate", label: "Burn Rate", type: "text" as const, required: true, placeholder: "Burn Rate" },
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      ...values,
      distance: Number(values.distance),
      cost_ratio: Number(values.cost_ratio),
      delivery_burn_rate: Number(values.delivery_burn_rate),
    }
    try {
      await createDelivery(payload).unwrap()
      toast({
        title: "Success",
        description: "Delivery created successfully",
      })
      helpers.resetForm()
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <div>
      <ViewPageHeader title="Create Delivery" description="Add a new delivery to the system" />
      <DeliveryForm
        title="Delivery Information"
        description="Enter the details for a new delivery"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isCreating}
        onSubmit={handleSubmit}
        submitLabel="Create Delivery"
        onCancel={() => router.back()}
      />
    </div>
  )
}
