"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2, Upload } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface BrandPackage {
  type: string
  quantity: number
  wholesale_price: number
  retail_price: number
  retail_price_with_markup: number
}

export default function CreateBrandPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
  })
  const [packages, setPackages] = useState<BrandPackage[]>([
    {
      type: "",
      quantity: 0,
      wholesale_price: 0,
      retail_price: 0,
      retail_price_with_markup: 0,
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (packages.some((pkg) => !pkg.type || pkg.quantity <= 0 || pkg.wholesale_price <= 0)) {
      newErrors.packages = "All package fields are required and must be valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        packages: packages.filter((pkg) => pkg.type && pkg.quantity > 0),
      }

      const response = await apiClient.post("/brands", payload)

      if (response.data.status === "success") {
        toast({
          title: "Success",
          description: "Brand created successfully",
        })
        router.push("/dashboard/brands")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create brand",
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

  const handlePackageChange = (index: number, field: keyof BrandPackage, value: string | number) => {
    const updatedPackages = [...packages]
    updatedPackages[index] = { ...updatedPackages[index], [field]: value }

    // Auto-calculate retail price with markup (assuming 20% markup)
    if (field === "retail_price") {
      updatedPackages[index].retail_price_with_markup = Number(value) * 1.2
    }

    setPackages(updatedPackages)
    if (errors.packages) {
      setErrors((prev) => ({ ...prev, packages: "" }))
    }
  }

  const addPackage = () => {
    setPackages([
      ...packages,
      {
        type: "",
        quantity: 0,
        wholesale_price: 0,
        retail_price: 0,
        retail_price_with_markup: 0,
      },
    ])
  }

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter((_, i) => i !== index))
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
          <h1 className="text-3xl font-bold text-[#444444]">Create Brand</h1>
          <p className="text-[#ababab]">Add a new brand to the system</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Brand Information</CardTitle>
          <CardDescription className="text-[#ababab]">Enter the details for the new brand</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#444444]">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#444444]">
                    Brand Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter brand name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[#444444]">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="household">Household</SelectItem>
                      <SelectItem value="personal_care">Personal Care</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#444444]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter brand description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-[#444444]">
                  Brand Image URL
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#444444]">Package Information</h3>
                <Button type="button" variant="outline" onClick={addPackage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>

              {errors.packages && <p className="text-sm text-red-500">{errors.packages}</p>}

              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-[#444444]">Package {index + 1}</h4>
                      {packages.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePackage(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#444444]">Package Type *</Label>
                        <Select value={pkg.type} onValueChange={(value) => handlePackageChange(index, "type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottle">Bottle</SelectItem>
                            <SelectItem value="can">Can</SelectItem>
                            <SelectItem value="pack">Pack</SelectItem>
                            <SelectItem value="carton">Carton</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="sachet">Sachet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#444444]">Quantity *</Label>
                        <Input
                          type="number"
                          value={pkg.quantity}
                          onChange={(e) => handlePackageChange(index, "quantity", Number(e.target.value))}
                          placeholder="0"
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#444444]">Wholesale Price *</Label>
                        <Input
                          type="number"
                          value={pkg.wholesale_price}
                          onChange={(e) => handlePackageChange(index, "wholesale_price", Number(e.target.value))}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#444444]">Retail Price *</Label>
                        <Input
                          type="number"
                          value={pkg.retail_price}
                          onChange={(e) => handlePackageChange(index, "retail_price", Number(e.target.value))}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#444444]">Price with Markup</Label>
                        <Input
                          type="number"
                          value={pkg.retail_price_with_markup}
                          onChange={(e) =>
                            handlePackageChange(index, "retail_price_with_markup", Number(e.target.value))
                          }
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Creating..." : "Create Brand"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
