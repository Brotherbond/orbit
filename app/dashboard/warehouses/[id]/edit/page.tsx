"use client"

import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { WarehouseForm } from "@/components/dashboard/WarehouseForm";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useUpdateWarehouseMutation } from "@/store/warehouses";
import type { Warehouse } from "@/types/warehouse";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useWarehouseContext } from "../warehouse-context";

export default function EditWarehousePage({ params }: { params: { id: string } }) {
  const { warehouse, isLoading, fetchWarehouse } = useWarehouseContext();
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [updateWarehouse] = useUpdateWarehouseMutation()

  const validationSchema = Yup.object({
    warehouse_code: Yup.string().required("Warehouse code is required"),
    address: Yup.string().required("Address is required"),
    location: Yup.object().shape({
      name: Yup.string().required("Location name is required"),
    }),
  });

  const handleSubmit = async (values: Warehouse, { setSubmitting, setFieldError }: any) => {
    try {
      const payload = {
        warehouse_code: values.warehouse_code,
        address: values.address,
        location: values.location,
      };
      await updateWarehouse({ id: params.id, data: payload }).unwrap();
      toast({ title: "Success", description: "Warehouse updated successfully" });
      fetchWarehouse();
      router.push(`/dashboard/warehouses/${params.id}`);
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "warehouse_code", label: "Warehouse Code", type: "text" as const, required: true, placeholder: "Warehouse Code" },
    { name: "address", label: "Address", type: "text" as const, required: true, placeholder: "Address" },
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
    <>
      <ViewPageHeader
        title="Update Warehouse"
        description="Edit warehouse information below"
      />
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
    </>
  )
}
