"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

interface SettingData {
  key: string
  value: string
  description: string
  status: string
}

export default function EditSettingPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<SettingData>({
    key: "",
    value: "",
    description: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchSetting()
    // eslint-disable-next-line
  }, [params.id])

  const fetchSetting = async () => {
    try {
      const response = await apiClient.get(`/settings/${params.id}`)
      const data = response.data as { status: string; data: { item: SettingData } }
      if (data.status === "success") {
        const setting = data.data.item
        setInitialValues({
          key: setting.key,
          value: setting.value,
          description: setting.description,
          status: setting.status,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch setting data",
        variant: "destructive",
      })
    }
  }

  const validationSchema = Yup.object({
    key: Yup.string().required("Key is required"),
    value: Yup.string().required("Value is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: SettingData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
       await apiClient.put(`/settings/${params.id}`, values)
         toast({ title: "Success", description: "Setting updated successfully" })
        router.push(`/dashboard/settings/${params.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update setting",
        variant: "destructive",
      })
      setFieldError("key", error.response?.data?.errors?.key || "")
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
          <h1 className="text-3xl font-bold text-[#444444]">Edit Setting</h1>
          <p className="text-[#ababab]">Update setting information</p>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Setting Information</CardTitle>
          <CardDescription>Update the setting details below</CardDescription>
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
                  <Label htmlFor="key">Key *</Label>
                  <Input
                    id="key"
                    name="key"
                    value={values.key}
                    onChange={handleChange}
                    placeholder="Enter setting key"
                  />
                  <ErrorMessage name="key" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Input
                    id="value"
                    name="value"
                    value={values.value}
                    onChange={handleChange}
                    placeholder="Enter value"
                  />
                  <ErrorMessage name="value" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(value) => setFieldValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="status" component="p" className="text-sm text-red-500" />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Updating..." : "Update Setting"}
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
