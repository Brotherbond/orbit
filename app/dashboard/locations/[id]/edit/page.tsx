"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup"

interface LocationData {
  city: string
  state: string
  region: string
  country: string
}


export default function EditLocationPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<LocationData>({
    city: "",
    state: "",
    region: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchLocation()
    // eslint-disable-next-line
  }, [params.id])

  const fetchLocation = async () => {
    try {
      const response = await apiClient.get(`/locations/${params.id}`)
      const data = response.data as { status: string; data?: { item: any }; item?: any }
      const item = data.data?.item || data.item
      if (item) {
        setInitialValues({
          city: item.city || "",
          state: item.state || "",
          region: item.region || "",
          country: item.country || "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch location data",
        variant: "destructive",
      })
    }
  }

  const validationSchema = Yup.object({
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    region: Yup.string().required("Region is required"),
    country: Yup.string().required("Country is required"),
  })

  const handleSubmit = async (values: LocationData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      await apiClient.put(`/locations/${params.id}`, values)
      toast({
        title: "Success",
        description: "Location updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update location",
        variant: "destructive",
      })
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message as string)
        })
      }
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
          <h1 className="text-3xl font-bold text-[#444444]">Edit Location</h1>
          <p className="text-[#ababab]">Update location information</p>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Update the location details below</CardDescription>
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
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                  <ErrorMessage name="city" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                  <ErrorMessage name="state" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Input
                    id="region"
                    name="region"
                    value={values.region}
                    onChange={handleChange}
                    placeholder="Enter region"
                  />
                  <ErrorMessage name="region" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />
                  <ErrorMessage name="country" component="p" className="text-sm text-red-500" />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Updating..." : "Update Location"}
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
