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
  const [formData, setFormData] = useState<UserData>({
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUser()
    fetchRoles()
    fetchMarkets()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await apiClient.get(`/users/${params.id}`)
      if (response.data.status === "success") {
        const user = response.data.data.item
        setFormData({
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
      if (response.data.status === "success") {
        setRoles(response.data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error)
    }
  }

  const fetchMarkets = async () => {
    try {
      const response = await apiClient.get("/markets")
      if (response.data.status === "success") {
        setMarkets(response.data.data.items)
      }
    } catch (error) {
      console.error("Failed to fetch markets:", error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.role_id) {
      newErrors.role_id = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await apiClient.put(`/users/${params.id}`, formData)

      if (response.data.status === "success") {
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-[#444444]">
                  First Name *
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Enter first name"
                />
                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-[#444444]">
                  Last Name *
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Enter last name"
                />
                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#444444]">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#444444]">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role_id" className="text-[#444444]">
                  Role *
                </Label>
                <Select value={formData.role_id} onValueChange={(value) => handleInputChange("role_id", value)}>
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
                {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="market_id" className="text-[#444444]">
                  Market
                </Label>
                <Select value={formData.market_id} onValueChange={(value) => handleInputChange("market_id", value)}>
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
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
