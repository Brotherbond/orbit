"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"
import { User } from "../../users/page"
import { Distributor } from "../page"

function ImeVssUserSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (uuid: string) => void
}) {
  const [options, setOptions] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    setLoading(true)
    apiClient
      .get<{ items: User[] }>(`/users?roles=ime,vss&search=${encodeURIComponent(debouncedSearch)}`)
      .then(({ data }) => setOptions(data.items))
      .finally(() => setLoading(false))
  }, [debouncedSearch])

  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    if (value) {
      // Try to find in options first
      const found = options.find((u) => u.id === value)
      if (found) setSelectedUser(found)
    }
  }, [value, options])

  const handleSelect = (uuid: string) => {
    if (!uuid) return;
    const found = options.find((u) => u.id === uuid)
    if (found) setSelectedUser(found)
    onChange(uuid)
  }

  return (
    <Select value={value || ''} onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? "Loading..." : "Select IME/VSS user"}
        >
          {selectedUser
            ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
            : undefined}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Search user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        {loading && <div className="px-3 py-2 text-gray-400">Searching...</div>}
        {options.length === 0 && !loading && (
          <div className="px-3 py-2 text-gray-400">No users found</div>
        )}
        {options.map(user => (
          <SelectItem key={user.uuid} value={user.uuid}>
            {user.first_name} {user.last_name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


export default function CreateDistributorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    market_id: "",
    business_name: "",
    address: "",
    ime_vss_user_id: "",
    send_notification: false,
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    password: Yup.string().required("Password is required"),
    market_id: Yup.string(),
    business_name: Yup.string().required("Business name is required"),
    address: Yup.string().required("Address is required"),
    ime_vss_user_id: Yup.string().required("IME VSS User is required"),
    send_notification: Yup.boolean(),
  })

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      const { data, status } = await apiClient.post<{ item: Distributor }>("/distributors", values);
      if (status === "success") {
        toast({
          title: "Success",
          description: "Distributor created successfully",
        })
        // router.push("/dashboard/distributors")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create distributor",
        variant: "destructive",
      })
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message as string)
        })
      }
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
                {/* Distributor Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#444444]">Distributor Information</h3>
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
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        type="email"
                      />
                      <ErrorMessage name="email" component="p" className="text-sm text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#444444]">
                        Phone
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
                      <Label htmlFor="password" className="text-[#444444]">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        type="password"
                      />
                      <ErrorMessage name="password" component="p" className="text-sm text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="market_id" className="text-[#444444]">
                        Market
                      </Label>
                      <Input
                        id="market_id"
                        name="market_id"
                        value={values.market_id}
                        onChange={handleChange}
                        placeholder="Enter market ID"
                      />
                      <ErrorMessage name="market_id" component="p" className="text-sm text-red-500" />
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#444444]">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      rows={3}
                    />
                    <ErrorMessage name="address" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ime_vss_user_id" className="text-[#444444]">
                      IME VSS User *
                    </Label>
                    <ImeVssUserSelect
                      value={values.ime_vss_user_id}
                      onChange={(uuid: string) => setFieldValue("ime_vss_user_id", uuid)}
                    />
                    <ErrorMessage name="ime_vss_user_id" component="p" className="text-sm text-red-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="send_notification"
                      name="send_notification"
                      type="checkbox"
                      checked={values.send_notification}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="send_notification" className="text-[#444444]">
                      Send Notification
                    </Label>
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
