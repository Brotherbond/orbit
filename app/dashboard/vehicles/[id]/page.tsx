"use client";
import { useVehicleContext } from "./vehicle-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import ViewPageHeader from "@/components/ViewPageHeader";
export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { vehicle, isLoading, fetchVehicle } = useVehicleContext();


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

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Vehicle not found</p>
      </div>
    )
  }

  const userRole = user?.role?.toLowerCase() || ""


  return (
    <div className="space-y-6">
      <ViewPageHeader
        title="Vehicle Details"
        description="View detailed information about this vehicle"
        showEditButton={true}
        editHref={`/dashboard/vehicles/${vehicle.uuid}/edit`}
        showDeleteButton={["super-admin", "admin", "manager"].includes(userRole)}
        deleteOptions={{
          storeName: "vehicles",
          uuid: vehicle.uuid,
          redirectPath: "/dashboard/vehicles"
        }}
      />
      {/* Main Content */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-[#444444]">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vehicle Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Vehicle Number</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.vehicle_number}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Type</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.type}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Fuel per Km (L)</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.fuel_per_km}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Height (m)</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.height}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Length (m)</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.length}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Width (m)</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.width}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Max Weight (kg)</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.max_weight}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Created At</p>
              <p className="font-sm text-sm text-[#666666]">{vehicle.created_at}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
