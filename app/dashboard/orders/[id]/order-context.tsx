"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/order";

interface OrderContextValue {
  order: Order | null;
  isLoading: boolean;
  fetchOrder: () => Promise<void>;
  setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ orderId, children }: { orderId: string; children: React.ReactNode }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ item: Order }>(`/orders/${orderId}`);
      setOrder(response.data.item ?? null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch order details",
        variant: "destructive",
      });
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <OrderContext.Provider value={{ order, isLoading, fetchOrder, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
}
