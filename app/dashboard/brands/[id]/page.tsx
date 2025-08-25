"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, FileText } from "lucide-react";
import Image from "next/image";
import { useBrandContext } from "./brand-context";

export default function BrandDetailPage() {
  const { brand } = useBrandContext();
  if (!brand) { return null; }

  return (
    <div>
      <ViewPageHeader
        title={brand.name}
        description="Brand Details"
        showEditButton={true}
        editHref={`/dashboard/brands/${brand.uuid}/edit`}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "brands",
          uuid: brand.uuid,
        }}
      />

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
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=96&width=96&text=Brand";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Tag className="h-5 w-5 text-[#ababab]" />
                      <div>
                        <p className="text-sm text-[#ababab]">Brand Name</p>
                        <p className="font-medium text-[#444444]">{brand.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-[#ababab]" />
                      <div>
                        <p className="text-sm text-[#ababab]">Category</p>
                        <Badge variant="secondary">{brand.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-[#ababab]" />
                      <div>
                        <p className="text-sm text-[#ababab]">Total Packages</p>
                        <p className="font-medium text-[#444444]">{brand.packages?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  {brand.description && (
                    <div className="mt-4 flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-[#ababab] mt-1" />
                      <div>
                        <p className="text-sm text-[#ababab]">Description</p>
                        <p className="text-[#444444]">{brand.description}</p>
                      </div>
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
                          <p className="text-sm text-[#ababab]">Width</p>
                          <p className="font-medium text-[#444444]">
                            {pkg.width !== undefined ? pkg.width : <span className="text-[#ababab]">N/A</span>}
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
  );
}
