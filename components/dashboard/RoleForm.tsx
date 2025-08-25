"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { useCreateRoleMutation, useUpdateRoleMutation } from "@/store/roles"
import type { Permission } from "@/types/role"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import * as Yup from "yup"

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
  const [isLoading] = useState(false)

  const router = useRouter()
  const [updateRole] = useUpdateRoleMutation()
  const [createRole] = useCreateRoleMutation()

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
      if (isEdit && roleId) {
        // Map string[] to Permission[]
        const permissionsPayload: Permission[] = values.permissions.map((uuid) => ({ uuid } as Permission));
        await updateRole({ id: roleId, data: { ...values, permissions: permissionsPayload } }).unwrap()
        toast({
          title: "Success",
          description: "Role updated successfully"
        });
        if (onSuccess) {
          onSuccess(values);
        } else {
          router.push(`/dashboard/roles/${roleId}`);
        }
      } else {
        const permissionsPayload: Permission[] = values.permissions.map((uuid) => ({ uuid } as Permission));
        await createRole({ ...values, permissions: permissionsPayload }).unwrap()
        toast({
          title: "Success",
          description: "Role created successfully"
        });
        if (onSuccess) {
          onSuccess(values);
        } else {
          resetForm();
        }
      }
    } catch (error: any) {
      if (error?.errors) {
        setFieldError("name", error.errors.name || "")
      }
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-3xl">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
