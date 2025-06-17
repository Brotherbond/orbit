"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface DistributorDetail {
  id: string
  uuid: string
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string
    status: string
  }
  business_name: string
  address: string
  business_type: string
  registration_number: string
  tax_id: string
  bank_name: string
  account_number: string
  account_name: string
  performance: {
    total_orders: number
    total_value: number
    growth_rate: number
    last_order_date: string
  }
  created_at: string
}

export default function DistributorDetailPage({ params }: { params: { id: string } }) {
  const [distributor, setDistributor] = useState<DistributorDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDistributor()
  }, [params.id])

  const fetchDistributor = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/distributors/${params.id}`)
      if (response.data.status === "success") {
        setDistributor(response.data.data.item)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch distributor details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this distributor?")) return

    try {
      await apiClient.delete(`/distributors/${params.id}`)
      toast({
        title: "Success",
        description: "Distributor deleted successfully",
      })
      router.push("/dashboard/distributors")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete distributor",
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

  if (!distributor) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Distributor not found</p>
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
            <h1 className="text-3xl font-bold text-[#444444]">{distributor.business_name}</h1>
            <p className="text-[#ababab]">Distributor Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/distributors/${distributor.uuid}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/distributors/${distributor.uuid}/orders`)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Orders
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
              <CardTitle className="text-[#444444]">Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Business Name</p>
                    <p className="font-medium text-[#444444]">{distributor.business_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{distributor.business_type}</Badge>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-[#ababab] mt-1" />
                  <div>
                    <p className="text-sm text-[#ababab]">Address</p>
                    <p className="font-medium text-[#444444]">{distributor.address}</p>
                  </div>
                </div>
                {distributor.registration_number && (
                  <div>
                    <p className="text-sm text-[#ababab]">Registration Number</p>
                    <p className="font-medium text-[#444444]">{distributor.registration_number}</p>
                  </div>
                )}
                {distributor.tax_id && (
                  <div>
                    <p className="text-sm text-[#ababab]">Tax ID</p>
                    <p className="font-medium text-[#444444]">{distributor.tax_id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Email</p>
                    <p className="font-medium text-[#444444]">{distributor.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Phone</p>
                    <p className="font-medium text-[#444444]">{distributor.user.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Contact Person</p>
                  <p className="font-medium text-[#444444]">
                    {distributor.user.first_name} {distributor.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Status</p>
                  <Badge
                    variant={distributor.user.status === "active" ? "default" : "destructive"}
                    className={distributor.user.status === "active" ? "status-active" : "status-inactive"}
                  >
                    {distributor.user.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {(distributor.bank_name || distributor.account_number) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#444444]">Banking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {distributor.bank_name && (
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-[#ababab]" />
                      <div>
                        <p className="text-sm text-[#ababab]">Bank Name</p>
                        <p className="font-medium text-[#444444]">{distributor.bank_name}</p>
                      </div>
                    </div>
                  )}
                  {distributor.account_number && (
                    <div>
                      <p className="text-sm text-[#ababab]">Account Number</p>
                      <p className="font-medium text-[#444444]">{distributor.account_number}</p>
                    </div>
                  )}
                  {distributor.account_name && (
                    <div>
                      <p className="text-sm text-[#ababab]">Account Name</p>
                      <p className="font-medium text-[#444444]">{distributor.account_name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Total Orders</span>
                <span className="font-bold text-[#444444]">{distributor.performance?.total_orders || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Total Value</span>
                <span className="font-bold text-[#444444]">
                  ₦{(distributor.performance?.total_value || 0).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Growth Rate</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-bold">{distributor.performance?.growth_rate || 0}%</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-[#ababab]">Last Order</span>
                <span className="font-medium text-[#444444]">
                  {distributor.performance?.last_order_date
                    ? new Date(distributor.performance.last_order_date).toLocaleDateString()
                    : "No orders yet"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/dashboard/orders/create?distributor=${distributor.uuid}`)}
              >
                Create Order
              </Button>
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
