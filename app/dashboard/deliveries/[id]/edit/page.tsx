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
  });

  const initialValues = {
    order_id: delivery?.order?.uuid || "",
    vehicle_id: delivery?.vehicle?.uuid || "",
  };

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    const payload = {
      order_id: values.order_id,
      vehicle_id: values.vehicle_id,
    } as Partial<Delivery>;
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
