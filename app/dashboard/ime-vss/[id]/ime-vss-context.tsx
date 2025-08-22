"use client";
import { useToast } from "@/hooks/use-toast";
import { useGetIMEVSSQuery } from "@/store/ime-vss";
import type { User } from "@/types/user";
import React, { createContext, useCallback, useContext, useMemo } from "react";

interface ImeVssContextValue {
  imeVss: User | null;
  isLoading: boolean;
  fetchImeVss: () => void;
  refetch: () => void;
}

const ImeVssContext = createContext<ImeVssContextValue | undefined>(undefined);

export function ImeVssProvider({ imeVssId, children }: { imeVssId: string; children: React.ReactNode }) {
  const { toast } = useToast();

  const {
    data: imeVss,
    isLoading,
    error,
    refetch
  } = useGetIMEVSSQuery(imeVssId);

  // Handle errors from the query
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as any)?.message || "Failed to fetch IME-VSS details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const fetchImeVss = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <ImeVssContext.Provider value={{ imeVss: imeVss ?? null, isLoading, fetchImeVss, refetch }}>
      {children}
    </ImeVssContext.Provider>
  );
}

export function useImeVssContext() {
  const ctx = useContext(ImeVssContext);
  if (!ctx) throw new Error("useImeVssContext must be used within an ImeVssProvider");
  return ctx;
}

// Custom hooks for specific IME-VSS data
export function useImeVss() {
  const { imeVss } = useImeVssContext();
  return useMemo(() => imeVss, [imeVss]);
}

export function useImeVssInfo() {
  const { imeVss } = useImeVssContext();
  return useMemo(() => ({
    id: imeVss?.id,
    uuid: imeVss?.uuid,
    full_name: imeVss?.full_name,
    email: imeVss?.email,
    phone: imeVss?.phone,
    status: imeVss?.status,
  }), [imeVss]);
}
