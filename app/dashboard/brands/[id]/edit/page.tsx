"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


interface BrandData {
  name: string
  description: string
  status: string
}

export default function EditBrandPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<BrandData>({
    name: "",
    description: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchBrand()
    // eslint-disable-next-line
  }, [params.id])

  const fetchBrand = async () => {
    try {
      const response = await apiClient.get(`/brands/${params.id}`)
      const data = response.data as { status: string; data: { item: BrandData } }
      if (data.status === "success") {
        setInitialValues(data.data.item)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch brand data",
        variant: "destructive",
      })
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Brand name is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: BrandData, { setSubmitting }: any) => {
    setIsLoading(true)
    try {
      await apiClient.put(`/brands/${params.id}`, values)
      toast({
        title: "Success",
        description: "Brand updated successfully",
      })
      router.push(`/dashboard/brands/${params.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update brand",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Edit Brand</h1>
          <p className="text-[#ababab]">Update brand information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Brand Information</CardTitle>
          <CardDescription className="text-[#ababab]">Update the brand details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#444444]">
                    Brand Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                  />
                  <ErrorMessage name="name" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#444444]">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                  />
                  <ErrorMessage name="description" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#444444]">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ErrorMessage name="status" component="p" className="text-sm text-red-500" />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Updating..." : "Update Brand"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
