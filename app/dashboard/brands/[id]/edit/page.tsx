"use client";
import BrandForm from "@/components/dashboard/BrandForm";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { Brand, BrandPackage } from "@/types/brand";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function EditBrandPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBrand() {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<{ item: Brand }>(`/brands/${params.id}`);
        const brand = data.item;
        setInitialValues({
          name: brand.name || "",
          category: brand.category || "",
          image: brand.image || "",
          packages: (brand.packages || []).map((pkg: BrandPackage) => ({
            uuid: pkg.uuid,
            type: pkg.type || "",
            quantity: pkg.quantity || 0,
            breadth: pkg.breadth || 0,
            height: pkg.height || 0,
            length: pkg.length || 0,
            weight: pkg.weight || 0,
            wholesale_price: pkg.wholesale_price || 0,
            retail_price: pkg.retail_price || 0,
            retail_price_with_markup: pkg.retail_price_with_markup || 0,
            og_price: pkg.og_price || 0,
            distributor_price: pkg.distributor_price || 0,
          })),
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to fetch brand details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrand();
    // eslint-disable-next-line
  }, [params.id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Brand name is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.string(),
    packages: Yup.array()
      .of(
        Yup.object({
          type: Yup.string().required("Type is required"),
          quantity: Yup.number().min(1, "Quantity must be greater than 0").required("Quantity is required"),
          breadth: Yup.number().min(0, "Breadth must be at least 0"),
          height: Yup.number().min(0, "Height must be at least 0"),
          length: Yup.number().min(0, "Length must be at least 0"),
          weight: Yup.number().min(0, "Weight must be at least 0"),
          wholesale_price: Yup.number().min(0.0, "Wholesale price must be greater than 0").required("Wholesale price is required"),
          retail_price: Yup.number().min(0.0, "Retail price must be at least 0").required("Retail price is required"),
          retail_price_with_markup: Yup.number().min(0, "Price with markup must be at least 0"),
          og_price: Yup.number().min(0.0, "OG price must be at least 0").required("OG price is required"),
          distributor_price: Yup.number().min(0.0, "Distributor price must be at least 0").required("Distributor price is required"),
        })
      )
      .min(1, "At least one package is required"),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("_method", "PUT");
      formData.append("category", values.category);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const filteredPackages = values.packages.filter((pkg: BrandPackage) => pkg.type && pkg.quantity > 0);
      filteredPackages.forEach((pkg: BrandPackage, idx: number) => {
        Object.entries(pkg).forEach(([key, val]) => {
          formData.append(`packages[${idx}][${key}]`, String(val));
        });
      });
      await apiClient.post(`/brands/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success",
        description: "Brand updated successfully",
      });
      router.push(`/dashboard/brands/${params.id}`);
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
          description: error.message || "Failed to update brand",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (isLoading || !initialValues) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <BrandForm
      mode="edit"
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
