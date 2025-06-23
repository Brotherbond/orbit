"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

export default function CreateMarketPage() {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const initialValues = {
    name: "",
    description: "",
    status: "active",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post("/markets", values)
      const data = response.data as { status: string }
      if (data.status === "success") {
        toast({ title: "Success", description: "Market created successfully" })
        router.push("/dashboard/markets")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create market",
        variant: "destructive",
      })
      setFieldError("name", error.response?.data?.errors?.name || "")
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
          <h1 className="text-3xl font-bold text-[#444444]">Create Market</h1>
          <p className="text-[#ababab]">Add a new market to the system</p>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Market Information</CardTitle>
          <CardDescription>Enter the details for the new market</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter market name"
                  />
                  <ErrorMessage name="name" component="p" className="text-sm text-red-500" />
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
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Creating..." : "Create Market"}
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
