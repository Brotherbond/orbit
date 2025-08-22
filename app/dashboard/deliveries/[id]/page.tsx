"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Boxes, Calendar, Flame, Package, Percent, Ruler, Scale, Truck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useDeliveryContext } from "./delivery-context";
import { formatLabelToTitleCase } from "@/lib/label-formatters";

export default function DeliveryDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const { delivery } = useDeliveryContext();
  const router = useRouter();
  const { toast } = useToast();

  const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>> | undefined> = {
    orderRef: Package,
    vehicleNumber: Truck,
    vehicleType: Truck,
    distance: Ruler,
    costRatio: Percent,
    burnRate: Flame,
    orderVolume: Boxes,
    orderWeight: Scale,
    status: Calendar,
    createdAt: Calendar,
  };

  const userRole = user?.role?.toLowerCase() || ""

  const Icon = ({ name }: { name: keyof typeof icons }) => {
    const Cmp = icons[name];
    return Cmp ? <Cmp className="h-5 w-5 text-[#ababab]" /> : null;
  };

  return (
    <div>
      <ViewPageHeader
        title="Delivery Details"
        description="View detailed information about this delivery"
        showEditButton={true}
        editHref={`/dashboard/deliveries/${delivery.uuid}/edit`}
        showDeleteButton={["super-admin", "admin", "manager"].includes(userRole)}
        deleteOptions={{
          storeName: "deliveries",
          uuid: delivery.uuid,
        }}
      />
      {/* Main Content */}
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          {/* Delivery Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Icon name="orderRef" />
              <div>
                <p className="text-sm text-[#ababab]">Order Ref</p>
                <p className="font-medium text-[#444444]">{delivery.order?.ref}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="vehicleNumber" />
              <div>
                <p className="text-sm text-[#ababab]">Vehicle Number</p>
                <p className="font-medium text-[#444444]">{delivery.vehicle?.vehicle_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="vehicleType" />
              <div>
                <p className="text-sm text-[#ababab]">Vehicle Type</p>
                <p className="font-medium text-[#444444]">{delivery.vehicle?.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="status" />
              <div>
                <p className="text-sm text-[#ababab]">Status</p>
                <p className="font-medium text-[#444444]">{formatLabelToTitleCase(delivery.status)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="distance" />
              <div>
                <p className="text-sm text-[#ababab]">Distance (km)</p>
                <p className="font-medium text-[#444444]">{delivery.distance}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="costRatio" />
              <div>
                <p className="text-sm text-[#ababab]">Cost Ratio</p>
                <p className="font-medium text-[#444444]">{delivery.cost_ratio}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="burnRate" />
              <div>
                <p className="text-sm text-[#ababab]">Burn Rate</p>
                <p className="font-medium text-[#444444]">{delivery.delivery_burn_rate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="orderVolume" />
              <div>
                <p className="text-sm text-[#ababab]">Order Volume (m³)</p>
                <p className="font-medium text-[#444444]">{delivery.total_order_volume}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="orderWeight" />
              <div>
                <p className="text-sm text-[#ababab]">Order Weight (kg)</p>
                <p className="font-medium text-[#444444]">{delivery.total_order_weight}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="createdAt" />
              <div>
                <p className="text-sm text-[#ababab]">Created At</p>
                <p className="font-medium text-[#444444]">{delivery.created_at}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
