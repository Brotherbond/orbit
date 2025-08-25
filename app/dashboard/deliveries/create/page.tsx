"use client"

import { DeliveryForm } from "@/components/dashboard/DeliveryForm"
import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { toast } from "@/hooks/use-toast"
import { catchError } from "@/lib/utils"
import { useCreateDeliveryMutation } from "@/store/deliveries"
import { useRouter } from "next/navigation"
import * as Yup from "yup"

export default function CreateDeliveryPage() {
  const router = useRouter()
  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation()

  const initialValues = {
    order_id: "",
    vehicle_id: "",
    from_location_id: "",
    to_location_id: "",
  }

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Order is required"),
    vehicle_id: Yup.string().required("Vehicle is required"),
    from_location_id: Yup.string().required("Pickup location is required"),
    to_location_id: Yup.string().required("Drop off location is required"),
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
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      order_id: values.order_id,
      vehicle_id: values.vehicle_id,
    }
    try {
      await createDelivery(payload as any).unwrap()
      toast({
        title: "Success",
        description: "Delivery created successfully",
      })
      helpers.resetForm()
    } catch (error: any) {
      catchError(error, helpers.setFieldError)
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
