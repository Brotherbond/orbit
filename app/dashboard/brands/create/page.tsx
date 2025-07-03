"use client";
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { ErrorMessage, FieldArray, Form, Formik } from "formik"
import { ArrowLeft, Plus, Save, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

import * as Yup from "yup"

interface BrandPackage {
  type: string
  quantity: number
  wholesale_price: number
  retail_price: number
  retail_price_with_markup: number
  og_price: number
  distributor_price: number
}

export default function CreateBrandPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const initialValues = {
    name: "",
    category: "",
    // description: "",
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
    ] as BrandPackage[],
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Brand name is required"),
    category: Yup.string().required("Category is required"),
    // description: Yup.string(),
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
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      // formData.append("description", values.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const filteredPackages = values.packages.filter((pkg) => pkg.type && pkg.quantity > 0);
      filteredPackages.forEach((pkg, idx) => {
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
      // router.push("/dashboard/brands");
    } catch (error: any) {
      let errorSet = false;
      // Handle errors as array of objects (apiClient pattern)
      if (Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => {
          if (err && typeof err.field === "string" && typeof err.message === "string") {
            setFieldError(err.field, err.message);
            errorSet = true;
          }
        });
      }
      // Handle errors as object map (CreateDistributorPage pattern)
      // if (error.response?.data?.errors && typeof error.response.data.errors === "object" && !Array.isArray(error.response.data.errors)) {
      //   Object.entries(error.response.data.errors).forEach(([field, message]) => {
      //     setFieldError(field, message as string);
      //     errorSet = true;
      //   });
      // }
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
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Create Brand</h1>
          <p className="text-[#ababab]">Add a new brand to the system</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Brand Information</CardTitle>
          <CardDescription className="text-[#ababab]">Enter the details for the new brand</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#444444]">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="category" className="text-[#444444]">
                        Category *
                      </Label>
                      <Select
                        value={values.category}
                        onValueChange={(value) => setFieldValue("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beverages">Beverages</SelectItem>
                          <SelectItem value="snacks">Snacks</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="household">Household</SelectItem>
                          <SelectItem value="personal_care">Personal Care</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="category" component="p" className="text-sm text-red-500" />
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#444444]">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      placeholder="Enter brand description"
                      rows={3}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-[#444444]">
                      Brand Image *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      {imageFile && (
                        <span className="text-xs text-[#444444]">{imageFile.name}</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Package Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#444444]">Package Information</h3>
                    <FieldArray
                      name="packages"
                      render={arrayHelpers => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            arrayHelpers.push({
                              type: "",
                              quantity: 0,
                              wholesale_price: 0,
                              retail_price: 0,
                              retail_price_with_markup: 0,
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Package
                        </Button>
                      )}
                    />
                  </div>
                  <ErrorMessage name="packages" component="p" className="text-sm text-red-500" />
                  <div className="space-y-4">
                    {values.packages.map((pkg, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-[#444444]">Package {index + 1}</h4>
                          {values.packages.length > 1 && (
                            <FieldArray
                              name="packages"
                              render={arrayHelpers => (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Package Type *</Label>
                            <Select
                              value={pkg.type}
                              onValueChange={value => setFieldValue(`packages[${index}].type`, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bottle">Bottle</SelectItem>
                                <SelectItem value="can">Can</SelectItem>
                                <SelectItem value="pack">Pack</SelectItem>
                                <SelectItem value="carton">Carton</SelectItem>
                                <SelectItem value="box">Box</SelectItem>
                                <SelectItem value="sachet">Sachet</SelectItem>
                              </SelectContent>
                            </Select>
                            <ErrorMessage name={`packages[${index}].type`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Quantity *</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].quantity`}
                              value={pkg.quantity}
                              onChange={e => setFieldValue(`packages[${index}].quantity`, Number(e.target.value))}
                              placeholder="0"
                              min="1"
                            />
                            <ErrorMessage name={`packages[${index}].quantity`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Wholesale Price *</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].wholesale_price`}
                              value={pkg.wholesale_price}
                              onChange={e => setFieldValue(`packages[${index}].wholesale_price`, Number(e.target.value))}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage name={`packages[${index}].wholesale_price`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Retail Price *</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].retail_price`}
                              value={pkg.retail_price}
                              onChange={e => {
                                setFieldValue(`packages[${index}].retail_price`, Number(e.target.value))
                                setFieldValue(`packages[${index}].retail_price_with_markup`, Number(e.target.value) * 1.2)
                              }}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage name={`packages[${index}].retail_price`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Price with Markup</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].retail_price_with_markup`}
                              value={pkg.retail_price_with_markup}
                              onChange={e => setFieldValue(`packages[${index}].retail_price_with_markup`, Number(e.target.value))}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage name={`packages[${index}].retail_price_with_markup`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">OG Price *</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].og_price`}
                              value={pkg.og_price}
                              onChange={e => setFieldValue(`packages[${index}].og_price`, Number(e.target.value))}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage name={`packages[${index}].og_price`} component="p" className="text-sm text-red-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#444444]">Distributor Price *</Label>
                            <Input
                              type="number"
                              name={`packages[${index}].distributor_price`}
                              value={pkg.distributor_price}
                              onChange={e => setFieldValue(`packages[${index}].distributor_price`, Number(e.target.value))}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                            <ErrorMessage name={`packages[${index}].distributor_price`} component="p" className="text-sm text-red-500" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Creating..." : "Create Brand"}
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
