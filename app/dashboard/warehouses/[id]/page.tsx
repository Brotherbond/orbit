"use client";
import { useWarehouseContext } from "./warehouse-context";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { handleDelete } from "@/lib/handleDelete";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { warehouse, isLoading, fetchWarehouse } = useWarehouseContext();
  const router = useRouter();
  const { toast } = useToast();


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

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Warehouse not found</p>
      </div>
    )
  }

  const userRole = user?.role?.toLowerCase() || ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[#444444]">
              Warehouse Details
            </h1>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="mb-6 text-[#FF6600] font-bold text-lg">
              Warehouse Code: {warehouse.warehouse_code}
            </div>
            {["admin", "manager"].includes(userRole) && (
              <Button
                variant="destructive"
                onClick={() =>
                  handleDelete({
                    entity: "warehouse",
                    uuid: warehouse.uuid,
                    endpoint: "/warehouses",
                    onSuccess: () => router.push("/dashboard/warehouses"),
                  })
                }
              >
                Delete Warehouse
              </Button>
            )}
          </div>
          {/* Warehouse Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Address</p>
              <p className="font-sm text-sm text-[#666666]">{warehouse.address}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Location</p>
              <p className="font-sm text-sm text-[#666666]">{warehouse.location?.full_location}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Longitude</p>
              <p className="font-sm text-sm text-[#666666]">{warehouse.longitude}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Latitude</p>
              <p className="font-sm text-sm text-[#666666]">{warehouse.latitude}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Created At</p>
              <p className="font-sm text-sm text-[#666666]">{warehouse.created_at}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
