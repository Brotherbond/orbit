"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, Fuel, Gauge, Ruler, Scale, Truck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useVehicleContext } from "./vehicle-context";

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { vehicle } = useVehicleContext();

  if (!vehicle) { return null; }

  const userRole = user?.role?.toLowerCase() || ""


  return (
    <div>
      <ViewPageHeader
        title="Vehicle Details"
        description="View detailed information about this vehicle"
        showEditButton={true}
        editHref={`/dashboard/vehicles/${vehicle.uuid}/edit`}
        showDeleteButton={["super-admin", "admin", "manager"].includes(userRole)}
        deleteOptions={{
          storeName: "vehicles",
          uuid: vehicle.uuid,
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
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Vehicle Number</p>
                <p className="font-medium text-[#444444]">{vehicle.vehicle_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Type</p>
                <p className="font-medium text-[#444444]">{vehicle.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Fuel className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Fuel per Km (L)</p>
                <p className="font-medium text-[#444444]">{vehicle.fuel_per_km}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Ruler className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Height (m)</p>
                <p className="font-medium text-[#444444]">{vehicle.height}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Ruler className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Length (m)</p>
                <p className="font-medium text-[#444444]">{vehicle.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Ruler className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Width (m)</p>
                <p className="font-medium text-[#444444]">{vehicle.width}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Scale className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Max Weight (kg)</p>
                <p className="font-medium text-[#444444]">{vehicle.max_weight}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Gauge className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Density</p>
                <p className="font-medium text-[#444444]">{vehicle.density}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created At</p>
                <p className="font-medium text-[#444444]">{vehicle.created_at}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
