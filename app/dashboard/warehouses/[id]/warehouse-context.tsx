"use client";
import React, { createContext, useContext, useCallback } from "react";
import { useGetWarehouseQuery } from "@/store/warehouses";
import { useToast } from "@/hooks/use-toast";
import type { Warehouse } from "@/types/warehouse";

interface WarehouseContextValue {
  warehouse: Warehouse | null;
  isLoading: boolean;
  fetchWarehouse: () => void;
  refetch: () => void;
}

const WarehouseContext = createContext<WarehouseContextValue | undefined>(undefined);

export function WarehouseProvider({ warehouseId, children }: { warehouseId: string; children: React.ReactNode }) {
  const { toast } = useToast();

  const {
    data: warehouse,
    isLoading,
    error,
    refetch
  } = useGetWarehouseQuery(warehouseId);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch warehouse details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchWarehouse = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <WarehouseContext.Provider value={{ warehouse: warehouse ?? null, isLoading, fetchWarehouse, refetch }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouseContext() {
  const ctx = useContext(WarehouseContext);
  if (!ctx) throw new Error("useWarehouseContext must be used within a WarehouseProvider");
  return ctx;
}
