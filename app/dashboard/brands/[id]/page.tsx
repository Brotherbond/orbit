"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Brand } from "@/types/brand";
export default function BrandDetailPage({ params }: { params: { id: string } }) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchBrand = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.get<{ item: Brand }>(`/brands/${params.id}`);
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
  }, [params.id, toast])

  useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

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

      <div className="grid grid-cols-1 gap-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-[#ababab]">Brand Name</p>
                      <p className="font-medium text-[#444444]">{brand.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#ababab]">Category</p>
                      <Badge variant="secondary">{brand.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-[#ababab]">Total Packages</p>
                      <p className="font-medium text-[#444444]">{brand.packages?.length || 0}</p>
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
                    <Card key={pkg.uuid || pkg.uuid} className="p-4 bg-[#f8f8f8]">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <p className="text-sm text-[#ababab]">Type</p>
                          <p className="font-medium text-[#444444] capitalize">{pkg.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Quantity</p>
                          <p className="font-medium text-[#444444]">{pkg.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Original Price</p>
                          <p className="font-medium text-[#444444]">
                            ₦{Number(pkg.og_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Wholesale Price</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.wholesale_price !== undefined
                              ? `₦${Number(pkg.wholesale_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Retail Price</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.retail_price !== undefined
                              ? `₦${Number(pkg.retail_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Retail Price (With Markup)</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.retail_price_with_markup !== undefined
                              ? `₦${Number(pkg.retail_price_with_markup).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Distributor Price</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.distributor_price !== undefined
                              ? `₦${Number(pkg.distributor_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Breadth</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.breadth !== undefined ? pkg.breadth : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Height</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.height !== undefined ? pkg.height : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Length</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.length !== undefined ? pkg.length : <span className="text-[#ababab]">N/A</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#ababab]">Weight</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.weight !== undefined ? pkg.weight : <span className="text-[#ababab]">N/A</span>}
                          </p>
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
      </div>
    </div>
  )
}
