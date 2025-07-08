"use client";
import { OrderProvider } from "./order-context";

export default function OrderLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <OrderProvider orderId={params.id}>
      {children}
    </OrderProvider>
  );
}
