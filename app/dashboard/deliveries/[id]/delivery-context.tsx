"use client";
import React, { createContext, useContext, useCallback } from "react";
import { useGetDeliveryQuery } from "@/store/deliveries";
import { useToast } from "@/hooks/use-toast";
import type { Delivery } from "@/types/delivery";

interface DeliveryContextValue {
  delivery: Delivery | null;
  isLoading: boolean;
  fetchDelivery: () => void;
  refetch: () => void;
}

const DeliveryContext = createContext<DeliveryContextValue | undefined>(undefined);

export function DeliveryProvider({ deliveryId, children }: { deliveryId: string; children: React.ReactNode }) {
  const { toast } = useToast();

  const {
    data: delivery,
    isLoading,
    error,
    refetch
  } = useGetDeliveryQuery(deliveryId);

  // Handle errors from the query
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch delivery details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchDelivery = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <DeliveryContext.Provider value={{ delivery: delivery ?? null, isLoading, fetchDelivery, refetch }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveryContext() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error("useDeliveryContext must be used within a DeliveryProvider");
  return ctx;
}
