"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export default function CreateDistributorPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users?role=distributor")
      const data = response.data as { status: string; data: { items: User[] } }
      if (data.status === "success") {
        setUsers(data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const initialValues = {
    user_id: "",
    business_name: "",
    address: "",
    business_type: "",
    registration_number: "",
    tax_id: "",
    bank_name: "",
    account_number: "",
    account_name: "",
  }

  const validationSchema = Yup.object({
    user_id: Yup.string().required("User is required"),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    business_type: Yup.string().required("Business type is required"),
    registration_number: Yup.string(),
    tax_id: Yup.string(),
    bank_name: Yup.string(),
    account_number: Yup.string(),
    account_name: Yup.string(),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post("/distributors", values)
      const data = response.data as { status: string }
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Distributor created successfully",
        })
        router.push("/dashboard/distributors")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create distributor",
        variant: "destructive",
      })
      setFieldError("business_name", error.response?.data?.errors?.business_name || "")
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
          <h1 className="text-3xl font-bold text-[#444444]">Create Distributor</h1>
          <p className="text-[#ababab]">Add a new distributor to the system</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Distributor Information</CardTitle>
          <CardDescription className="text-[#ababab]">Enter the details for the new distributor</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#444444]">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user_id" className="text-[#444444]">
                        Associated User *
                      </Label>
                      <Select
                        value={values.user_id}
                        onValueChange={(value) => setFieldValue("user_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name} {user.last_name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="user_id" component="p" className="text-sm text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_name" className="text-[#444444]">
                        Business Name *
                      </Label>
                      <Input
                        id="business_name"
                        name="business_name"
                        value={values.business_name}
                        onChange={handleChange}
                        placeholder="Enter business name"
                      />
                      <ErrorMessage name="business_name" component="p" className="text-sm text-red-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#444444]">
                      Business Address *
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      placeholder="Enter complete business address"
                      rows={3}
                    />
                    <ErrorMessage name="address" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_type" className="text-[#444444]">
                        Business Type *
                      </Label>
                      <Select
                        value={values.business_type}
                        onValueChange={(value) => setFieldValue("business_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="supermarket">Supermarket</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage name="business_type" component="p" className="text-sm text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registration_number" className="text-[#444444]">
                        Registration Number
                      </Label>
                      <Input
                        id="registration_number"
                        name="registration_number"
                        value={values.registration_number}
                        onChange={handleChange}
                        placeholder="Enter business registration number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id" className="text-[#444444]">
                      Tax ID
                    </Label>
                    <Input
                      id="tax_id"
                      name="tax_id"
                      value={values.tax_id}
                      onChange={handleChange}
                      placeholder="Enter tax identification number"
                    />
                  </div>
                </div>
                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#444444]">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_name" className="text-[#444444]">
                        Bank Name
                      </Label>
                      <Input
                        id="bank_name"
                        name="bank_name"
                        value={values.bank_name}
                        onChange={handleChange}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account_number" className="text-[#444444]">
                        Account Number
                      </Label>
                      <Input
                        id="account_number"
                        name="account_number"
                        value={values.account_number}
                        onChange={handleChange}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account_name" className="text-[#444444]">
                        Account Name
                      </Label>
                      <Input
                        id="account_name"
                        name="account_name"
                        value={values.account_name}
                        onChange={handleChange}
                        placeholder="Enter account name"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Creating..." : "Create Distributor"}
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
