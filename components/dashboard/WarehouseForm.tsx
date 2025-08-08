"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Formik, Form, ErrorMessage } from "formik"
import { SelectWithFetch } from "@/components/ui/select"

interface FieldConfig {
  name: string
  label: string
  type: "text" | "selectWithFetch"
  required?: boolean
  placeholder?: string
  fetchUrl?: string
  valueKey?: string
  labelKey?: string
}

interface WarehouseFormProps {
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

export function WarehouseForm({
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
}: WarehouseFormProps) {
  if (!initialValues) {
    return (
      <Card className={cardClassName || "max-w-2xl"}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }
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
                {fields.map(field => (
                  <div className="space-y-2" key={field.name}>
                    <Label htmlFor={field.name}>{field.label}{field.required && " *"}</Label>
                    {field.type === "selectWithFetch" ? (
                      <SelectWithFetch
                        fetchUrl={field.fetchUrl!}
                        value={values[field.name]}
                        onChange={uuid => setFieldValue(field.name, uuid)}
                        valueKey={field.valueKey}
                        labelKey={field.labelKey}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={values[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                    )}
                    <ErrorMessage name={field.name} component="p" className="text-sm text-red-500" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                  {isLoading || isSubmitting ? submitLabel + "..." : submitLabel}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

export default WarehouseForm
