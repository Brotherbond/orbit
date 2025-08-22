"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { DeliveryProvider, useDeliveryContext } from "./delivery-context";

function DeliveryLayoutContent({ children }: { children: React.ReactNode }) {
  const { delivery, isLoading } = useDeliveryContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!delivery) {
    notFound();
  }

  return <>{children}</>;
}

export default function DeliveryLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <DeliveryProvider deliveryId={params.id}>
      <DeliveryLayoutContent>
        {children}
      </DeliveryLayoutContent>
    </DeliveryProvider>
  );
}
