"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorMessage, Form, Formik } from "formik";
import { Save } from "lucide-react";
import * as Yup from "yup";

interface SettingFormProps {
  initialValues: {
    key: string;
    value: string;
    description: string;
    status: string;
  };
  validationSchema: Yup.ObjectSchema<any>;
  isLoading: boolean;
  onSubmit: (values: any, helpers: any) => void;
  submitLabel: string;
  title: string;
  description: string;
  onCancel: () => void;
}

export function SettingForm({
  initialValues,
  validationSchema,
  isLoading,
  onSubmit,
  submitLabel,
  title,
  description,
  onCancel,
}: SettingFormProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
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
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading || isSubmitting ? submitLabel + "..." : submitLabel}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
