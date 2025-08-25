"use client";
import { DeliveryForm } from "@/components/dashboard/DeliveryForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { toast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useUpdateDeliveryMutation } from "@/store/deliveries";
import type { Delivery } from "@/types/delivery";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useDeliveryContext } from "../delivery-context";

export default function EditDeliveryPage({ params }: { params: { id: string } }) {
  const { delivery, isLoading, fetchDelivery } = useDeliveryContext();
  const router = useRouter()
    const [updateDelivery] = useUpdateDeliveryMutation();

  if (!delivery) { return null; }

  const validationSchema = Yup.object({
    order_id: Yup.string().required("Order is required"),
    vehicle_id: Yup.string().required("Vehicle is required"),
    distance: Yup.string().required("Distance is required"),
    cost_ratio: Yup.string().required("Cost Ratio is required"),
    delivery_burn_rate: Yup.string().required("Burn Rate is required"),
    from: Yup.string().required("From location is required"),
    to: Yup.string().required("To location is required"),
  });

  const initialValues = { ...delivery, order_id: delivery?.order?.uuid, vehicle_id: delivery?.vehicle?.uuid, to: delivery?.to?.uuid, from: delivery?.from?.uuid };

  const handleSubmit = async (values: Delivery, helpers: any) => {
    const payload = {
      ...values,
      distance: Number(values.distance),
      cost_ratio: Number(values.cost_ratio),
      delivery_burn_rate: Number(values.delivery_burn_rate),
    };
    try {
      await updateDelivery({ id: params.id, data: payload }).unwrap();
      toast({ title: "Success", description: "Delivery updated successfully" });
      fetchDelivery();
      router.push(`/dashboard/deliveries/${params.id}`);
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false);
    }
  };

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
  ];

  return (
    <div>
      <ViewPageHeader title="Update Delivery" description="Edit delivery information below" />
      <DeliveryForm
        title="Delivery Information"
        description="Edit delivery information below"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        submitLabel="Update Delivery"
        onCancel={() => router.back()}
        cardClassName="max-w-2xl"
      />
    </div>
  )
}
