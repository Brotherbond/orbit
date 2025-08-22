"use client";
import { MarketForm } from "@/components/dashboard/MarketForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useGetLocationsQuery } from "@/store/locations";
import { useUpdateMarketMutation } from "@/store/markets";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useMarketContext } from "../market-context";

interface MarketData {
  name: string
  description: string
  type: string
  location_id: string
}

export default function EditMarketPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [updateMarket] = useUpdateMarketMutation();
  const { market, isLoading } = useMarketContext();
  const { data: locationsData, isLoading: locationsLoading } = useGetLocationsQuery();

  const initialValues: MarketData = {
    name: market?.name || "",
    description: market?.description || "",
    type: market?.type || "",
    location_id: market?.location?.uuid || "",
  };

  const locations: { uuid: string; full_location: string }[] = Array.isArray(locationsData) ? locationsData : locationsData || [];

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    type: Yup.string().oneOf(["InMarket", "OutMarket"]).required("Type is required"),
    location_id: Yup.string().required("Location is required"),
  });

  const handleSubmit = async (values: MarketData, helpers: any) => {
    try {
      await updateMarket({ id: params.id, data: values }).unwrap();
      toast({
        title: "Success",
        description: "Market updated successfully",
      });
      helpers.resetForm();
    } catch (error: any) {
      catchError(error, helpers.setFieldError);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter market name",
    },
    {
      name: "description",
      label: "Description",
      type: "text" as const,
      placeholder: "Enter description",
    },
    {
      name: "type",
      label: "Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "InMarket", label: "InMarket" },
        { value: "OutMarket", label: "OutMarket" },
      ],
      placeholder: "Select type",
    },
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
        title="Update Market"
        description="Edit market information below"
      />
      <MarketForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading || locationsLoading}
        onSubmit={handleSubmit}
        submitLabel="Update Market"
        title="Update Market"
        description="Edit market information below"
        onCancel={() => router.back()}
      />
    </>
  );
}
