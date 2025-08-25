"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { useSession } from "next-auth/react";
import { useWarehouseContext } from "./warehouse-context";
import { Map } from "@/components/ui/map";
import { MapPin, Navigation, Calendar, Landmark } from "lucide-react";

export default function WarehouseDetailPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { warehouse } = useWarehouseContext();

  if (!warehouse) { return null; }

  const userRole = user?.role?.toLowerCase() || "";
  const latNum = Number(warehouse?.location?.latitude) || undefined;
  const lngNum = Number(warehouse?.location?.longitude) || undefined;

  return (
    <div>
      <ViewPageHeader
        title="Warehouse Details"
        description={`Warehouse Code: ${warehouse.warehouse_code}`}
        showDeleteButton={["admin", "super-admin","manager"].includes(userRole)}
        deleteOptions={{
          storeName: "warehouses",
          uuid: warehouse.uuid,
        }}
      />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Information + Map grid (mirrors Locations page) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Warehouse Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#444444]">Warehouse Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Landmark className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Warehouse Code</p>
                    <p className="font-medium text-[#444444]">{warehouse.warehouse_code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Address</p>
                    <p className="font-medium text-[#444444]">{warehouse.address || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Location</p>
                    <p className="font-medium text-[#444444]">{warehouse.location?.full_location || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Navigation className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Coordinates</p>
                    <p className="font-medium text-[#444444]">
                      {latNum != null && lngNum != null
                        ? `${lngNum.toFixed(6)}, ${latNum.toFixed(6)}`
                        : "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Created</p>
                    <p className="font-medium text-[#444444]">{warehouse.created_at}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          {latNum != null && lngNum != null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#444444] flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Warehouse Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Map
                  latitude={latNum}
                  longitude={lngNum}
                  title={`Warehouse ${warehouse.warehouse_code}`}
                  height="400px"
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
