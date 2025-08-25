"use client"

import ViewPageHeader from "@/components/dashboard/ViewPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocationContext } from "./location-context"
import { Calendar, MapPin, Navigation, Store, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { Map } from "@/components/ui/map"

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { location } = useLocationContext()

  if (!location) { return null; }

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

      {/* Main Content */}
      <div className="space-y-6">
        {/* Location Information and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Store className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Markets Count</p>
                    <p className="font-medium text-[#444444]">{location.markets_count}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Created</p>
                    <p className="font-medium text-[#444444]">{location.created_at}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          {location.latitude && location.longitude && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#444444] flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Map
                  latitude={Number(location.latitude)}
                  longitude={Number(location.longitude)}
                  title={location.full_location}
                  height="400px"
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Markets Information Card */}
        {location.markets && location.markets.length > 0 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-[#444444] flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Markets in this Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#ababab] bg-gray-50">Market Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#ababab] bg-gray-50">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#ababab] bg-gray-50">Users</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#ababab] bg-gray-50">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {location.markets.map((market, idx) => (
                      <tr key={market.uuid || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-[#444444] font-medium">
                          {market.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#444444]">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {market.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#444444]">
                          {market.users && market.users.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-[#ababab]" />
                              <span>{market.users.length} users</span>
                            </div>
                          ) : (
                            <span className="text-[#ababab]">No users</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#444444]">
                          {new Date(market.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

