"use client";
import { useToast } from "@/hooks/use-toast";
import { useGetVehicleQuery } from "@/store/vehicles";
import type { Vehicle } from "@/types/vehicle";
import React, { createContext, useCallback, useContext } from "react";

interface VehicleContextValue {
  vehicle: Vehicle | null;
  isLoading: boolean;
  fetchVehicle: () => void;
  refetch: () => void;
}

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

export function VehicleProvider({ vehicleId, children }: { vehicleId: string; children: React.ReactNode }) {
  const { toast } = useToast();

  const {
    data: vehicle,
    isLoading,
    error,
    refetch
  } = useGetVehicleQuery(vehicleId);

  // Handle errors from the query
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch vehicle details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchVehicle = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <VehicleContext.Provider value={{ vehicle: vehicle ?? null, isLoading, fetchVehicle, refetch }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicleContext must be used within a VehicleProvider");
  return ctx;
}
