"use client";
import { DeliveryProvider } from "./delivery-context";

export default function DeliveryLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <DeliveryProvider deliveryId={params.id}>
      {children}
    </DeliveryProvider>
  );
}
