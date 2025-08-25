"use client";
import { toast } from "@/hooks/use-toast";
import { useGetDeliveryQuery } from "@/store/deliveries";
import type { Delivery } from "@/types/delivery";
import React, { createContext, useCallback, useContext } from "react";

interface DeliveryContextValue {
  delivery: Delivery | null;
  isLoading: boolean;
  fetchDelivery: () => void;
  refetch: () => void;
}

const DeliveryContext = createContext<DeliveryContextValue | undefined>(undefined);

export function DeliveryProvider({ deliveryId, children }: { deliveryId: string; children: React.ReactNode }) {
  

  const {
    data: delivery,
    isLoading,
    error,
    refetch
  } = useGetDeliveryQuery(deliveryId);


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
