"use client"

import { MarketForm } from "@/components/dashboard/MarketForm";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useToast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useGetLocationsQuery } from "@/store/locations";
import { useCreateMarketMutation } from "@/store/markets";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function CreateMarketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createMarket, { isLoading }] = useCreateMarketMutation();
  const { data: locationsData, isLoading: locationsLoading } = useGetLocationsQuery();

  const initialValues = {
    name: "",
    description: "",
    type: "",
    location_id: "",
  };

  const locations: { uuid: string; full_location: string }[] = Array.isArray(locationsData) ? locationsData : [];

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    type: Yup.string().oneOf(["InMarket", "OutMarket"]).required("Type is required"),
    location_id: Yup.string().required("Location is required"),
  });

  const handleSubmit = async (values: typeof initialValues, helpers: any) => {
    try {
      await createMarket(values).unwrap();
      toast({
        title: "Success",
        description: "Market created successfully",
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
        title="Create Market"
        description="Add a new market to the system"
      />
      <MarketForm
        title="Market Information"
        description="Add a new market to the system"
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        isLoading={isLoading || locationsLoading}
        onSubmit={handleSubmit}
        submitLabel="Create Market"
        onCancel={() => router.back()}
      />
    </>
  );
}
