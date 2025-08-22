"use client"

import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { Calendar, MapPin, Navigation } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

interface LocationDetail {
  uuid: string
  street: string
  city: string
  state: string
  region: string
  country: string
  full_location: string
  latitude?: number
  longitude?: number
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
  const router = useRouter()
  const { toast } = useToast()

  const fetchLocation = React.useCallback(async () => {
    try {
      const { data } = await apiClient.get<{ item: LocationDetail }>(`/locations/${params.id}`)
      setLocation(data.item ?? null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch location details",
        variant: "destructive",
      })
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchLocation()
  }, [fetchLocation])

  return (
    <div>
      <ViewPageHeader
        title={location.full_location}
        description="Location Details"
        showEditButton={true}
        editHref={`/dashboard/locations/${location.uuid}/edit`}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "locations",
          uuid: params.id,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Street</p>
                <p className="font-medium text-[#444444]">{location.street || "—"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">City</p>
                <p className="font-medium text-[#444444]">{location.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">State</p>
                <p className="font-medium text-[#444444]">{location.state}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Region</p>
                <p className="font-medium text-[#444444]">{location.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Country</p>
                <p className="font-medium text-[#444444]">{location.country}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Coordinates</p>
                <p className="font-medium text-[#444444]">
                  {location.latitude && location.longitude
                    ? `${Number(location.longitude)?.toFixed(6)}, ${Number(location.latitude)?.toFixed(6)}`
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Markets Count</p>
                <p className="font-medium text-[#444444]">{location.markets_count}</p>
              </div>
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

