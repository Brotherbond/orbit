"use client";
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
