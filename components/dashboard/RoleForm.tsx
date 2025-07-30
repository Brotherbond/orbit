"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"

export interface RoleFormValues {
  name: string
  description: string
  status: string
  access_type: string
  permissions: string[]
}

interface RoleFormProps {
  initialValues: RoleFormValues
  isEdit?: boolean
  roleId?: string
  onSuccess?: (data: any) => void
  title: string
  description: string
  submitButtonText: string
}

export const roleValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  status: Yup.string().oneOf(["active", "inactive"]).required(),
  access_type: Yup.string().oneOf(["web", "mobile"]).required(),
  permissions: Yup.array().of(Yup.string()),
})

export default function RoleForm({
  initialValues,
  isEdit = false,
  roleId,
  onSuccess,
  title,
  description,
  submitButtonText,
}: RoleFormProps) {
  const [permissions, setPermissions] = useState<{ uuid: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch permissions
    apiClient.get<{ items: { id: string; name: string }[] }>("/permissions?per_page=1000")
      .then((res) => {
        if (res.status === "success" && Array.isArray(res.data.items)) {
          const items = Array.isArray(res.data.items[0])
            ? (res.data.items as any).flat()
            : res.data.items;
          setPermissions(items)
        } else {
          setPermissions([])
        }
      })
      .catch(() => {
        setPermissions([])
      })
  }, [])

  const handleSubmit = async (values: RoleFormValues, { setSubmitting, setFieldError, resetForm }: any) => {
    setIsLoading(true)
    try {
      let response;
      
      if (isEdit && roleId) {
        response = await apiClient.put(`/roles/${roleId}`, values)
      } else {
        response = await apiClient.post("/roles", values)
      }
      
      if (response.status === "success") {
        toast({ 
          title: "Success", 
          description: isEdit ? "Role updated successfully" : "Role created successfully" 
        });
        
        if (onSuccess) {
          onSuccess(response.data);
        } else if (isEdit && roleId) {
          router.push(`/dashboard/roles/${roleId}`);
        } else {
          resetForm();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} role`,
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
          <h1 className="text-3xl font-bold text-[#444444]">{title}</h1>
          <p className="text-[#ababab]">{description}</p>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Role Information</CardTitle>
          <CardDescription>Enter the details for the role</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={roleValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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
                <div className="space-y-2">
                  <Label htmlFor="access_type">Access Type</Label>
                  <Select
                    value={values.access_type}
                    onValueChange={(value) => setFieldValue("access_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="access_type" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div
                    className="grid grid-cols-2 gap-2 overflow-y-auto rounded border border-muted"
                    style={{ maxHeight: 240, minHeight: 120 }}
                  >
                    {permissions.map((perm) => (
                      <label key={perm.uuid} className="flex items-center space-x-2 px-2 py-1">
                        <Field
                          type="checkbox"
                          name="permissions"
                          value={perm.uuid}
                          checked={values.permissions.includes(perm.uuid)}
                          onChange={() => {
                            if (values.permissions.includes(perm.uuid)) {
                              setFieldValue(
                                "permissions",
                                values.permissions.filter((id) => id !== perm.uuid)
                              )
                            } else {
                              setFieldValue(
                                "permissions",
                                [...values.permissions, perm.uuid]
                              )
                            }
                          }}
                          className="accent-primary"
                        />
                        <span>{perm.name}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage name="permissions" component="p" className="text-sm text-red-500" />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? (isEdit ? "Updating..." : "Creating...") : submitButtonText}
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
