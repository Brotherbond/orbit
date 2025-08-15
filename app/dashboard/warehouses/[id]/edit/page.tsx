"use client"

import { WarehouseForm } from "@/components/dashboard/WarehouseForm"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Warehouse } from "@/types/warehouse"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as Yup from "yup"
import { useWarehouseContext } from "../warehouse-context"

export default function EditWarehousePage({ params }: { params: { id: string } }) {
  const { warehouse, isLoading, fetchWarehouse } = useWarehouseContext();
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const validationSchema = Yup.object({
    warehouse_code: Yup.string().required("Warehouse code is required"),
    address: Yup.string().required("Address is required"),
    longitude: Yup.string().required("Longitude is required"),
    latitude: Yup.string().required("Latitude is required"),
    location: Yup.object().shape({
      name: Yup.string().required("Location name is required"),
    }),
  });

  const handleSubmit = async (values: Warehouse, { setSubmitting, setFieldError }: any) => {
    try {
      const payload = {
        warehouse_code: values.warehouse_code,
        address: values.address,
        longitude: values.longitude,
        latitude: values.latitude,
        location: values.location,
      };
      const response = await apiClient.put<any>(`/warehouses/${params.id}`, payload);
      if (response.status === "success") {
        toast({ title: "Success", description: "Warehouse updated successfully" });
        fetchWarehouse();
        router.push(`/dashboard/warehouses/${params.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update warehouse",
        variant: "destructive",
      });
      setFieldError("warehouse_code", error.response?.data?.errors?.warehouse_code || "");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "warehouse_code", label: "Warehouse Code", type: "text" as const, required: true, placeholder: "Warehouse Code" },
    { name: "address", label: "Address", type: "text" as const, required: true, placeholder: "Address" },
    { name: "longitude", label: "Longitude", type: "text" as const, required: true, placeholder: "Longitude" },
    { name: "latitude", label: "Latitude", type: "text" as const, required: true, placeholder: "Latitude" },
    {
      name: "location_id",
      label: "Location",
      type: "selectWithFetch" as const,
      required: true,
      fetchUrl: "/locations",
      valueKey: "uuid",
      labelKey: "full_location",
      placeholder: "Select location",
    },
  ];

  return (
    <WarehouseForm
      title="Update Warehouse"
      description="Edit warehouse information below"
      initialValues={warehouse as Warehouse}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Update Warehouse"
      onCancel={() => router.back()}
      cardClassName="max-w-2xl"
    />
  )
}
