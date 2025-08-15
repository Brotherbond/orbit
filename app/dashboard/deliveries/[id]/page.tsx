"use client";
import { useDeliveryContext } from "./delivery-context";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { handleDelete } from "@/lib/handleDelete";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function DeliveryDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { delivery, isLoading, fetchDelivery } = useDeliveryContext();
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

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Delivery not found</p>
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
              Delivery Details
            </h1>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="mb-6 text-[#FF6600] font-bold text-lg">
              Delivery ID: {delivery.uuid}
            </div>
            {["admin", "manager"].includes(userRole) && (
              <Button
                variant="destructive"
                onClick={() =>
                  handleDelete({
                    entity: "delivery",
                    uuid: delivery.uuid,
                    endpoint: "/deliveries",
                    onSuccess: () => router.push("/dashboard/deliveries"),
                  })
                }
              >
                Delete Delivery
              </Button>
            )}
          </div>
          {/* Delivery Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Order Ref</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.order?.ref}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Vehicle Type</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.vehicle?.type}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Distance (km)</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.distance}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Cost Ratio</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.cost_ratio}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Burn Rate</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.delivery_burn_rate}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Order Volume (m³)</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.total_order_volume}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Order Weight (kg)</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.total_order_weight}</p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Created At</p>
              <p className="font-sm text-sm text-[#666666]">{delivery.created_at}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
