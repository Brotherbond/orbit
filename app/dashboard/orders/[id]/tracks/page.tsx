"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [orderEvents, setOrderEvents] = useState<any[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-[#444444]">Order Tracking</h1>
      </div>
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
                    By: {event.user?.full_name || "System"}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
