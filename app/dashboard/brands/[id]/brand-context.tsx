"use client";
import { useGetBrandQuery } from "@/store/brands";
import type { Brand } from "@/types/brand";
import React, { createContext, useCallback, useContext } from "react";

interface BrandContextValue {
  brand: Brand | null;
  isLoading: boolean;
  fetchBrand: () => void;
  refetch: () => void;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

export function BrandProvider({ brandId, children }: { brandId: string; children: React.ReactNode }) {
  const {
    data: brand,
    isLoading,
    error,
    refetch
  } = useGetBrandQuery(brandId);

  const fetchBrand = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <BrandContext.Provider value={{ brand: brand ?? null, isLoading, fetchBrand, refetch }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandContext() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrandContext must be used within a BrandProvider");
  return ctx;
}
