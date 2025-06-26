"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface LocationDetail {
  uuid: string
  city: string
  state: string
  region: string
  country: string
  full_location: string
  markets_count: number
  markets: Array<{
    uuid: string
    location: {
      uuid: string
      city: string
      state: string
      region: string
      country: string
      full_location: string
      created_at: string
    }
    name: string
    type: string
    full_name: string
    users: Array<any>
    created_at: string
  }>
  created_at: string
  updated_at: string
}

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<LocationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchLocation = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await apiClient.get<{ item: LocationDetail }>(`/locations/${params.id}`)
      setLocation(data.item ?? null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch location details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      await apiClient.delete(`/locations/${params.id}`)
      toast({
        title: "Success",
        description: "Location deleted successfully",
      })
      router.push("/dashboard/locations")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete location",
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

  if (!location) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Location not found</p>
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
              {location.full_location}
            </h1>
            <p className="text-[#ababab]">Location Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/locations/${location.uuid}/edit`)}>
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
            <CardTitle className="text-[#444444]">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-[#ababab]">City</span>
              <div className="font-medium text-[#444444]">{location.city}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">State</span>
              <div className="font-medium text-[#444444]">{location.state}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Region</span>
              <div className="font-medium text-[#444444]">{location.region}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Country</span>
              <div className="font-medium text-[#444444]">{location.country}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Markets Count</span>
              <div className="font-medium text-[#444444]">{location.markets_count}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Markets</span>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-[#ababab]">Name</th>
                      <th className="px-2 py-1 text-left text-[#ababab]">Type</th>
                      <th className="px-2 py-1 text-left text-[#ababab]">Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.markets?.map((market, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{market.full_name}</td>
                        <td className="px-2 py-1">{market.type}</td>
                        <td className="px-2 py-1">
                          {market.users && market.users.length > 0
                            ? market.users.map((user) => user.full_name).join(", ")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created</p>
                <p className="font-medium text-[#444444]">{location.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
