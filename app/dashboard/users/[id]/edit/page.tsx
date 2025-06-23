"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

interface Role {
  id: string
  name: string
}

interface Market {
  id: string
  name: string
}

interface UserData {
  first_name: string
  last_name: string
  email: string
  phone: string
  market_id: string
  role_id: string
  status: string
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<UserData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    market_id: "",
    role_id: "",
    status: "active",
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUser()
    fetchRoles()
    fetchMarkets()
    // eslint-disable-next-line
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await apiClient.get(`/users/${params.id}`)
      const data = response.data as { status: string; data: { item: UserData & { market?: Market; role?: Role } } }
      if (data.status === "success") {
        const user = data.data.item
        setInitialValues({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          market_id: user.market?.id || "",
          role_id: user.role?.id || "",
          status: user.status,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get("/roles")
      const data = response.data as { status: string; data: { items: Role[] } }
      if (data.status === "success") {
        setRoles(data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error)
    }
  }

  const fetchMarkets = async () => {
    try {
      const response = await apiClient.get("/markets")
      const data = response.data as { status: string; data: { items: Market[] } }
      if (data.status === "success") {
        setMarkets(data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch markets:", error)
    }
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    market_id: Yup.string(),
    role_id: Yup.string().required("Role is required"),
    status: Yup.string().oneOf(["active", "inactive"]).required(),
  })

  const handleSubmit = async (values: UserData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const response = await apiClient.put(`/users/${params.id}`, values)
      const data = response.data as { status: string }
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "User updated successfully",
        })
        router.push(`/dashboard/users/${params.id}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      })
      setFieldError("email", error.response?.data?.errors?.email || "")
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
          <h1 className="text-3xl font-bold text-[#444444]">Edit User</h1>
          <p className="text-[#ababab]">Update user information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">User Information</CardTitle>
          <CardDescription className="text-[#ababab]">Update the user details below</CardDescription>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-[#444444]">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    <ErrorMessage name="first_name" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-[#444444]">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    <ErrorMessage name="last_name" component="p" className="text-sm text-red-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#444444]">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                    <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#444444]">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                    <ErrorMessage name="phone" component="p" className="text-sm text-red-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role_id" className="text-[#444444]">
                      Role *
                    </Label>
                    <Select
                      value={values.role_id}
                      onValueChange={(value) => setFieldValue("role_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="role_id" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="market_id" className="text-[#444444]">
                      Market
                    </Label>
                    <Select
                      value={values.market_id}
                      onValueChange={(value) => setFieldValue("market_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        {markets.map((market) => (
                          <SelectItem key={market.id} value={market.id}>
                            {market.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[#444444]">
                    Status
                  </Label>
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
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting ? "Updating..." : "Update User"}
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
