"use client";
import React, { createContext, useContext, useCallback } from "react";
import { useGetOrderQuery } from "@/store/orders";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/order";

interface OrderContextValue {
  order: Order | null;
  isLoading: boolean;
  fetchOrder: () => void;
  refetch: () => void;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ orderId, children }: { orderId: string; children: React.ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useGetOrderQuery(orderId);

  // Handle errors from the query
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch order details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchOrder = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <OrderContext.Provider value={{ order: order ?? null, isLoading, fetchOrder, refetch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
}
