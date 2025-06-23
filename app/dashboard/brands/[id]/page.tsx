"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface BrandPackage {
  id: string
  type: string
  quantity: number
  wholesale_price: number
  retail_price: number
  retail_price_with_markup: number
}

interface BrandDetail {
  id: string
  uuid: string
  name: string
  category: string
  description: string
  image: string
  packages: BrandPackage[]
  created_at: string
  updated_at: string
}

export default function BrandDetailPage({ params }: { params: { id: string } }) {
  const [brand, setBrand] = useState<BrandDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchBrand()
  }, [params.id])

  const fetchBrand = async () => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.get<{ item: BrandDetail }>(`/brands/${params.id}`);
      setBrand(data.item ?? null)
    } catch (error: any) {
      setBrand(null)
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch brand details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand?")) return

    try {
      await apiClient.delete(`/brands/${params.id}`)
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      })
      router.push("/dashboard/brands")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Brand not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#444444]">{brand.name}</h1>
            <p className="text-[#ababab]">Brand Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/brands/${brand.uuid}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                {brand.image && (
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={brand.image || "/placeholder.svg"}
                      alt={brand.name}
                      fill
                      className="object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=96&width=96&text=Brand"
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#ababab]">Brand Name</p>
                      <p className="font-medium text-[#444444]">{brand.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#ababab]">Category</p>
                      <Badge variant="secondary">{brand.category}</Badge>
                    </div>
                  </div>
                  {brand.description && (
                    <div className="mt-4">
                      <p className="text-sm text-[#ababab]">Description</p>
                      <p className="text-[#444444]">{brand.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444] flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Package Information
              </CardTitle>
              <CardDescription className="text-[#ababab]">
                Available packages and pricing for this brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              {brand.packages && brand.packages.length > 0 ? (
                <div className="space-y-4">
                  {brand.packages.map((pkg, index) => (
                    <Card key={pkg.id} className="p-4 bg-[#f8f8f8]">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-[#ababab]">Type</p>
                          <p className="font-medium text-[#444444] capitalize">{pkg.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Quantity</p>
                          <p className="font-medium text-[#444444]">{pkg.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Wholesale Price</p>
                          <p className="font-medium text-[#444444]">₦{pkg.wholesale_price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Retail Price</p>
                          <p className="font-medium text-[#444444]">₦{pkg.retail_price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Price with Markup</p>
                          <p className="font-medium text-[#444444]">₦{pkg.retail_price_with_markup.toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-[#ababab] mx-auto mb-4" />
                  <p className="text-[#ababab]">No packages configured for this brand</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Total Packages</span>
                <span className="font-bold text-[#444444]">{brand.packages?.length || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Price Range</span>
                <div className="text-right">
                  {brand.packages && brand.packages.length > 0 ? (
                    <div className="text-sm">
                      <div className="font-medium text-[#444444]">
                        ₦{Math.min(...brand.packages.map((p) => p.retail_price)).toLocaleString()} - ₦
                        {Math.max(...brand.packages.map((p) => p.retail_price)).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[#ababab]">No pricing</span>
                  )}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Created</span>
                <span className="font-medium text-[#444444]">{brand.created_at}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Add to Order
              </Button>
              <Button className="w-full" variant="outline">
                View Sales History
              </Button>
              <Button className="w-full" variant="outline">
                Update Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
