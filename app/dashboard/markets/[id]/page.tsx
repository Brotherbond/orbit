"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { handleDelete } from "@/lib/handleDelete"
import { ArrowLeft, Calendar, Edit, MapPin, Store, Trash2, Type } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

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
  const router = useRouter()
  const { toast } = useToast()

  const fetchMarket = React.useCallback(async () => {
    try {
      const { data } = await apiClient.get<{ item: MarketDetail }>(`/markets/${params.id}`)
      setMarket(data.item ?? null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch market details",
        variant: "destructive",
      })
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchMarket()
  }, [fetchMarket])

  return (
    <div>
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
          <Button variant="destructive" onClick={() => handleDelete({
            storeName: "markets",
            uuid: params.id,
            onSuccess: () => router.push("/dashboard/markets"),
          })}>
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
            <div className="flex items-center space-x-3">
              <Store className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Full Name</p>
                <p className="font-medium text-[#444444]">{market.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Type className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Type</p>
                <p className="font-medium text-[#444444]">{market.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Location</p>
                <p className="font-medium text-[#444444]">{market.location?.full_location}</p>
              </div>
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
