"use client";;
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrderContext } from "../order-context";
export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [orderEvents, setOrderEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const { order } = useOrderContext();
  const router = useRouter();

  const [evidenceOpen, setEvidenceOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsEventsLoading(true);
      try {
        const response = await apiClient.get<{ items: any[] }>(`/orders/${params.id}/events`);
        setOrderEvents(response.data.items ?? []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to fetch order events",
          variant: "destructive",
        });
      } finally {
        setIsEventsLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!order) { return null; }

  return (
    <div>
      <ViewPageHeader
        title="Order Tracking"
        description="Track order status and history"
      />
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#444]">Tracking History</h2>
          {isEventsLoading ? (
            <div className="text-gray-400">Loading tracking events...</div>
          ) : orderEvents.length === 0 ? (
            <div className="text-gray-400">No tracking events found.</div>
          ) : (
            <ol className="relative border-l border-[#FF6600] ml-2">
              {orderEvents.map((event, idx) => (
                <li key={event.uuid || idx} className="mb-8 ml-6">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-[#FF6600] rounded-full ring-8 ring-white">
                    <span className="w-3 h-3 bg-white rounded-full border-2 border-[#FF6600]" />
                  </span>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="font-semibold text-[#FF6600]">{event.action}</span>
                    <span className="text-xs text-gray-500">{event.created_at}</span>
                  </div>
                  <div className="text-sm text-[#444] mt-1">
                    By: {event.user?.full_name || event.user || ""}
                  </div>
                  {event.action === "Order Delivered" && (
                    <div className="mt-2">
                      {order?.delivery_image ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEvidenceOpen(true)}
                          >
                            View evidence
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary">No image</Badge>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
      <Modal
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        size="lg-center"
        title="Delivery Evidence"
      >
        <Image src={order?.delivery_image ?? ""} alt="Delivery Evidence" width={600} height={400} className="max-w-full max-h-[60vh] mx-auto" />
      </Modal>
    </div>
  );
}
