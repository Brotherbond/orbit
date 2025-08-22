"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Form, Formik } from "formik";
import { Save } from "lucide-react";
import * as Yup from "yup";

interface LocationFormProps {
  initialValues: {
    street: string;
    city: string;
    state: string;
    region: string;
    country: string;
    latitude: number | string;
    longitude: number | string;
  };
  validationSchema: Yup.ObjectSchema<any>;
  isLoading: boolean;
  onSubmit: (values: any, helpers: any) => void;
  submitLabel: string;
  title: string;
  description: string;
  onCancel: () => void;
}

export function LocationForm({
  initialValues,
  validationSchema,
  isLoading,
  onSubmit,
  submitLabel,
  title,
  description,
  onCancel,
}: LocationFormProps) {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={values.street}
                    onChange={handleChange}
                    placeholder="Enter street"
                  />
                  <ErrorMessage name="street" component="p" className="text-sm text-red-500" />
                </div>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    min={-180}
                    max={180}
                    step="any"
                    value={values.longitude}
                    onChange={handleChange}
                    placeholder="Enter longitude (e.g., -74.0060)"
                  />
                  <ErrorMessage name="longitude" component="p" className="text-sm text-red-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    min={-180}
                    max={180}
                    step="any"
                    value={values.latitude}
                    onChange={handleChange}
                    placeholder="Enter latitude (e.g., 40.7128)"
                  />
                  <ErrorMessage name="latitude" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2"></div>
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
