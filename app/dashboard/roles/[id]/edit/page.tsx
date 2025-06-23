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

interface RoleData {
  name: string
  description: string
  status: string
}

export default function EditRolePage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<RoleData>({
    name: "",
    description: "",
    status: "active",
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchRole()
    // eslint-disable-next-line
  }, [params.id])

  const fetchRole = async () => {
    try {
      const response = await apiClient.get(`/roles/${params.id}`)
      const data = response.data as { status: string; data: { item: RoleData } }
      if (data && data.status === "success") {
        const role = data.data.item
        setInitialValues({
          name: role.name,
          description: role.description,
          status: role.status,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch role data",
        variant: "destructive",
      })
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: RoleData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const response = await apiClient.put(`/roles/${params.id}`, values)
      const data = response.data as { status: string; data: { item: RoleData } }
      if (data && data.status === "success") {
        toast({ title: "Success", description: "Role updated successfully" })
        router.push(`/dashboard/roles/${params.id}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update role",
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
          <h1 className="text-3xl font-bold text-[#444444]">Edit Role</h1>
          <p className="text-[#ababab]">Update role information</p>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>Update the role details below</CardDescription>
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
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter role name"
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
                    {isLoading || isSubmitting ? "Updating..." : "Update Role"}
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
