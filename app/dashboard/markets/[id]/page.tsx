"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface MarketDetail {
  uuid: string
  name: string
  type: string
  full_name: string
  created_at: string
  location: {
    uuid: string
    city: string
    state: string
    region: string
    country: string
    full_location: string
    created_at: string
  }
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const [market, setMarket] = useState<MarketDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchMarket = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await apiClient.get<{ item: MarketDetail }>(`/markets/${params.id}`)
      setMarket(data.item ?? null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch market details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchMarket()
  }, [fetchMarket])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this market?")) return

    try {
      await apiClient.delete(`/markets/${params.id}`)
      toast({
        title: "Success",
        description: "Market deleted successfully",
      })
      router.push("/dashboard/markets")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete market",
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

  if (!market) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Market not found</p>
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
            <h1 className="text-3xl font-bold text-[#444444]">
              {market.name}
            </h1>
            <p className="text-[#ababab]">Market Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/markets/${market.uuid}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Market Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-[#ababab]">Full Name</span>
              <div className="font-medium text-[#444444]">{market.full_name}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Type</span>
              <div className="font-medium text-[#444444]">{market.type}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Location</span>
              <div className="font-medium text-[#444444]">{market.location?.full_location}</div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created</p>
                <p className="font-medium text-[#444444]">{market.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
