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

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

export default function CreateDistributorPage() {
  const [formData, setFormData] = useState({
    user_id: "",
    business_name: "",
    address: "",
    business_type: "",
    registration_number: "",
    tax_id: "",
    bank_name: "",
    account_number: "",
    account_name: "",
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users?role=distributor")
      if (response.data.status === "success") {
        setUsers(response.data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.user_id) {
      newErrors.user_id = "User is required"
    }

    if (!formData.business_name.trim()) {
      newErrors.business_name = "Business name is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.business_type) {
      newErrors.business_type = "Business type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await apiClient.post("/distributors", formData)

      if (response.data.status === "success") {
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#444444]">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-[#444444]">
                    Associated User *
                  </Label>
                  <Select value={formData.user_id} onValueChange={(value) => handleInputChange("user_id", value)}>
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
                  {errors.user_id && <p className="text-sm text-red-500">{errors.user_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_name" className="text-[#444444]">
                    Business Name *
                  </Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange("business_name", e.target.value)}
                    placeholder="Enter business name"
                  />
                  {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#444444]">
                  Business Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete business address"
                  rows={3}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_type" className="text-[#444444]">
                    Business Type *
                  </Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => handleInputChange("business_type", value)}
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
                  {errors.business_type && <p className="text-sm text-red-500">{errors.business_type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_number" className="text-[#444444]">
                    Registration Number
                  </Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    onChange={(e) => handleInputChange("registration_number", e.target.value)}
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
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange("tax_id", e.target.value)}
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
                    value={formData.bank_name}
                    onChange={(e) => handleInputChange("bank_name", e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number" className="text-[#444444]">
                    Account Number
                  </Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange("account_number", e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_name" className="text-[#444444]">
                    Account Name
                  </Label>
                  <Input
                    id="account_name"
                    value={formData.account_name}
                    onChange={(e) => handleInputChange("account_name", e.target.value)}
                    placeholder="Enter account name"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Distributor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
