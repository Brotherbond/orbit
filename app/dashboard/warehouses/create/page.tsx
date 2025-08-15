"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import * as Yup from "yup"
import { useCreateWarehouseMutation } from "@/store/warehouses"
import { WarehouseForm } from "@/components/dashboard/WarehouseForm"

export default function CreateWarehousePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation()

  const initialValues = {
    warehouse_code: "",
    address: "",
    location_id: "",
    longitude: "",
    latitude: "",
  }

  const validationSchema = Yup.object({
    warehouse_code: Yup.string().required("Warehouse code is required"),
    address: Yup.string().required("Address is required"),
    location_id: Yup.string().required("Location is required"),
    longitude: Yup.string().required("Longitude is required"),
    latitude: Yup.string().required("Latitude is required"),
  })

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
  ]

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    try {
      await createWarehouse(values).unwrap()
      toast({
        title: "Success",
        description: "Warehouse created successfully",
      })
      helpers.resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create warehouse",
        variant: "destructive",
      })
    }
    helpers.setSubmitting(false)
  }

  return (
    <WarehouseForm
      title="Create Warehouse"
      description="Add a new warehouse to the system"
      initialValues={initialValues}
      validationSchema={validationSchema}
      fields={fields}
      isLoading={isCreating}
      onSubmit={handleSubmit}
      submitLabel="Create Warehouse"
      onCancel={() => router.back()}
    />
  )
}
