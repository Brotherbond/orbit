"use client";
import { toast } from "@/hooks/use-toast";
import { useGetWarehouseQuery } from "@/store/warehouses";
import type { Warehouse } from "@/types/warehouse";
import React, { createContext, useCallback, useContext } from "react";

interface WarehouseContextValue {
  warehouse: Warehouse | null;
  isLoading: boolean;
  fetchWarehouse: () => void;
  refetch: () => void;
}

const WarehouseContext = createContext<WarehouseContextValue | undefined>(undefined);

export function WarehouseProvider({ warehouseId, children }: { warehouseId: string; children: React.ReactNode }) {

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
