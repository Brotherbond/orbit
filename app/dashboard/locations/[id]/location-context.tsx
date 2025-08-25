"use client";
import { toast } from "@/hooks/use-toast";
import { useGetLocationQuery } from "@/store/locations";
import type { Location } from "@/types/location";
import React, { createContext, useCallback, useContext } from "react";

interface LocationContextValue {
  location: Location | null;
  isLoading: boolean;
  fetchLocation: () => void;
  refetch: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ locationId, children }: { locationId: string; children: React.ReactNode }) {

  const {
    data: location,
    isLoading,
    error,
    refetch
  } = useGetLocationQuery(locationId);


  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch location details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchLocation = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <LocationContext.Provider value={{ location: location ?? null, isLoading, fetchLocation, refetch }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within a LocationProvider");
  return ctx;
}
