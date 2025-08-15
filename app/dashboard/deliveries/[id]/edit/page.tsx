"use client";
import { useDeliveryContext } from "../delivery-context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import * as Yup from "yup";
import { DeliveryForm } from "@/components/dashboard/DeliveryForm"
import type { Delivery } from "@/types/delivery"

export default function EditDeliveryPage({ params }: { params: { id: string } }) {
  const { delivery, isLoading, fetchDelivery } = useDeliveryContext();
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const validationSchema = Yup.object({
    distance: Yup.number().required("Distance is required"),
    cost_ratio: Yup.number().required("Cost ratio is required"),
    delivery_burn_rate: Yup.number().required("Burn rate is required"),
    total_order_volume: Yup.number().required("Order volume is required"),
    total_order_weight: Yup.number().required("Order weight is required"),
  });

  const handleSubmit = async (values: Delivery, { setSubmitting, setFieldError }: any) => {
    try {
      const payload = {
        distance: values.distance,
        cost_ratio: values.cost_ratio,
        delivery_burn_rate: values.delivery_burn_rate,
        total_order_volume: values.total_order_volume,
        total_order_weight: values.total_order_weight,
      };
      const response = await apiClient.put<any>(`/deliveries/${params.id}`, payload);
      if (response.status === "success") {
        toast({ title: "Success", description: "Delivery updated successfully" });
        fetchDelivery();
        router.push(`/dashboard/deliveries/${params.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update delivery",
        variant: "destructive",
      });
      setFieldError("distance", error.response?.data?.errors?.distance || "");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "distance", label: "Distance (km)", type: "text" as const, required: true, placeholder: "Distance" },
    { name: "cost_ratio", label: "Cost Ratio", type: "text" as const, required: true, placeholder: "Cost Ratio" },
    { name: "delivery_burn_rate", label: "Burn Rate", type: "text" as const, required: true, placeholder: "Burn Rate" },
    { name: "total_order_volume", label: "Order Volume (m³)", type: "text" as const, required: true, placeholder: "Order Volume" },
    { name: "total_order_weight", label: "Order Weight (kg)", type: "text" as const, required: true, placeholder: "Order Weight" },
  ];

  return (
    <DeliveryForm
      title="Update Delivery"
      description="Edit delivery information below"
      initialValues={delivery as Delivery}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Update Delivery"
      onCancel={() => router.back()}
      cardClassName="max-w-2xl"
    />
  )
}
