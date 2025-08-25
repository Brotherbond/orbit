"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { handleDelete } from "@/lib/handleDelete";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWarehouseContext } from "./warehouse-context";

export default function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { warehouse, fetchWarehouse } = useWarehouseContext();
  const router = useRouter();

  if (!warehouse) { return null; }

  const userRole = user?.role?.toLowerCase() || ""

  return (
    <div>
      <ViewPageHeader
        title="Warehouse Details"
        description={`Warehouse Code: ${warehouse.warehouse_code}`}
        showDeleteButton={["admin", "manager"].includes(userRole)}
        deleteOptions={{
          storeName: "warehouses",
          uuid: warehouse.uuid,
        }}
      />
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
                    storeName: "warehouses",
                    uuid: warehouse.uuid,
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
