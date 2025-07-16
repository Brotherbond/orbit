"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import BrandForm from "@/components/dashboard/BrandForm";


export default function CreateBrandPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const initialValues = {
    name: "",
    category: "",
    image: "",
    packages: [
      {
        type: "",
        quantity: 0,
        wholesale_price: 0,
        retail_price: 0,
        retail_price_with_markup: 0,
        og_price: 0,
        distributor_price: 0,
      },
    ],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Brand name is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.string(),
    packages: Yup.array()
      .of(
        Yup.object({
          type: Yup.string().required("Type is required"),
          quantity: Yup.number().min(1, "Quantity must be greater than 0").required("Quantity is required"),
          wholesale_price: Yup.number().min(0.01, "Wholesale price must be greater than 0").required("Wholesale price is required"),
          retail_price: Yup.number().min(0.01, "Retail price must be greater than 0").required("Retail price is required"),
          retail_price_with_markup: Yup.number().min(0, "Price with markup must be at least 0"),
          og_price: Yup.number().min(0.01, "OG price must be greater than 0").required("OG price is required"),
          distributor_price: Yup.number().min(0.01, "Distributor price must be greater than 0").required("Distributor price is required"),
        })
      )
      .min(1, "At least one package is required"),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError, resetForm }: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const filteredPackages = values.packages.filter((pkg: any) => pkg.type && pkg.quantity > 0);
      filteredPackages.forEach((pkg: any, idx: number) => {
        Object.entries(pkg).forEach(([key, val]) => {
          formData.append(`packages[${idx}][${key}]`, String(val));
        });
      });
      await apiClient.post("/brands", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success",
        description: "Brand created successfully",
      });
      resetForm();
    } catch (error: any) {
      let errorSet = false;
      if (Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => {
          if (err && typeof err.field === "string" && typeof err.message === "string") {
            setFieldError(err.field, err.message);
            errorSet = true;
          }
        });
      }
      if (!errorSet) {
        toast({
          title: "Error",
          description: error.message || "Failed to create brand",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <BrandForm
      mode="create"
      initialValues={initialValues}
      validationSchema={validationSchema}
      isLoading={isLoading}
      imageFile={imageFile}
      setImageFile={setImageFile}
      onSubmit={handleSubmit}
      onBack={() => router.back()}
    />
  );
}
