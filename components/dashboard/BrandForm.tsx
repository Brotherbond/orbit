import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import React from "react";

interface BrandPackage {
  uuid?: string;
  type: string;
  quantity: number;
  wholesale_price: number;
  retail_price: number;
  retail_price_with_markup: number;
  og_price: number;
  distributor_price: number;
}

interface BrandFormProps {
  mode: "create" | "edit";
  initialValues: any;
  validationSchema: any;
  isLoading: boolean;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  onBack: () => void;
}

export function BrandForm({
  mode,
  initialValues,
  validationSchema,
  isLoading,
  imageFile,
  setImageFile,
  onSubmit,
  onBack,
}: BrandFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">
            {mode === "create" ? "Create Brand" : "Edit Brand"}
          </h1>
          <p className="text-[#ababab]">
            {mode === "create" ? "Add a new brand to the system" : "Update brand details"}
          </p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Brand Information</CardTitle>
          <CardDescription className="text-[#ababab]">
            {mode === "create"
              ? "Enter the details for the new brand"
              : "Edit the details for this brand"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={onSubmit}
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
                      {values.image && !imageFile && (
                        <span className="text-xs text-[#444444]">{values.image.split("/").pop()}</span>
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
                              og_price: 0,
                              distributor_price: 0,
                              uuid: undefined,
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Package
                        </Button>
                      )}
                    />
                  </div>
                  <ErrorMessage
                    name="packages"
                    render={msg =>
                      typeof msg === "string"
                        ? <p className="text-sm text-red-500">{msg}</p>
                        : <p className="text-sm text-red-500">{JSON.stringify(msg)}</p>
                    }
                  />
                  <div className="space-y-4">
                    {values.packages.map((pkg: BrandPackage, index: number) => (
                      <Card key={pkg.uuid || index} className="p-4">
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
                                setFieldValue(`packages[${index}].retail_price`, Number(e.target.value));
                                setFieldValue(`packages[${index}].retail_price_with_markup`, Number(e.target.value) * 1.2);
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
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting
                      ? mode === "create"
                        ? "Creating..."
                        : "Updating..."
                      : mode === "create"
                        ? "Create Brand"
                        : "Update Brand"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

export default BrandForm;
