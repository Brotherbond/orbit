"use client"

import React, { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectWithFetch } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"
import { Formik, Form, ErrorMessage } from "formik"

type FieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "selectWithFetch"
  | "switch"
  | "checkbox"

interface FieldOption {
  label: string
  value: string
}

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: FieldOption[]
  fetchUrl?: string
  valueKey?: string
  labelKey?: string
  rows?: number
  colSpan?: number
}

interface UserFormProps {
  title: string
  description: string
  initialValues: Record<string, any>
  validationSchema: any
  fields: FieldConfig[]
  isLoading: boolean
  onSubmit: (values: any, helpers: any) => Promise<void>
  submitLabel: string
  onCancel: () => void
  cardClassName?: string
}

export function UserForm({
  title,
  description,
  initialValues,
  validationSchema,
  fields,
  isLoading,
  onSubmit,
  submitLabel,
  onCancel,
  cardClassName,
}: UserFormProps) {
  // For selectWithFetch fields, manage fetched options
  const [fetchedOptions, setFetchedOptions] = useState<Record<string, FieldOption[]>>({})

  useEffect(() => {
    fields.forEach(field => {
      if (field.type === "selectWithFetch" && field.fetchUrl) {
        apiClient.get(field.fetchUrl)
          .then(({ data }: any) => {
            setFetchedOptions(prev => ({
              ...prev,
              [field.name]: (data.items || []).map((item: any) => ({
                label: item[field.labelKey || "name"],
                value: item[field.valueKey || "uuid"],
              })),
            }))
          })
          .catch(() => {
            setFetchedOptions(prev => ({ ...prev, [field.name]: [] }))
          })
      }
    })
  }, [fields])

  return (
    <Card className={cardClassName || "max-w-2xl"}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields
                  .filter(field => field.type !== "switch" && field.type !== "checkbox")
                  .map((field, idx) => {
                    if (field.type === "textarea") {
                      return (
                        <div className="space-y-2 md:col-span-2" key={field.name}>
                          <Label htmlFor={field.name}>{field.label}{field.required && " *"}</Label>
                          <Textarea
                            id={field.name}
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                          />
                          <ErrorMessage name={field.name} component="p" className="text-sm text-red-500" />
                        </div>
                      )
                    }
                    if (field.type === "select") {
                      return (
                        <div className="space-y-2" key={field.name}>
                          <Label htmlFor={field.name}>{field.label}{field.required && " *"}</Label>
                          <Select
                            value={values[field.name]}
                            onValueChange={value => setFieldValue(field.name, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage name={field.name} component="p" className="text-sm text-red-500" />
                        </div>
                      )
                    }
                    if (field.type === "selectWithFetch") {
                      return (
                        <div className="space-y-2" key={field.name}>
                          <Label htmlFor={field.name}>{field.label}{field.required && " *"}</Label>
                          <SelectWithFetch
                            fetchUrl={field.fetchUrl!}
                            value={values[field.name]}
                            onChange={uuid => setFieldValue(field.name, uuid)}
                            valueKey={field.valueKey}
                            labelKey={field.labelKey}
                            placeholder={field.placeholder}
                          />
                          <ErrorMessage name={field.name} component="p" className="text-sm text-red-500" />
                        </div>
                      )
                    }
                    // Default: text, email, password
                    return (
                      <div className="space-y-2" key={field.name}>
                        <Label htmlFor={field.name}>{field.label}{field.required && " *"}</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={values[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        <ErrorMessage name={field.name} component="p" className="text-sm text-red-500" />
                      </div>
                    )
                  })}
              </div>
              {/* Render switch/checkbox fields on a separate row */}
              {fields
                .filter(field => field.type === "switch" || field.type === "checkbox")
                .map(field => {
                  if (field.type === "switch") {
                    return (
                      <div className="flex items-center space-x-2 mt-4" key={field.name}>
                        <Switch
                          id={field.name}
                          checked={values[field.name]}
                          onCheckedChange={checked => setFieldValue(field.name, checked)}
                        />
                        <Label htmlFor={field.name}>{field.label}</Label>
                      </div>
                    )
                  }
                  if (field.type === "checkbox") {
                    return (
                      <div className="flex items-center space-x-2 mt-4" key={field.name}>
                        <input
                          id={field.name}
                          name={field.name}
                          type="checkbox"
                          checked={values[field.name]}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={field.name}>{field.label}</Label>
                      </div>
                    )
                  }
                  return null
                })}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading || isSubmitting ? "Creating..." : submitLabel}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

export default UserForm
