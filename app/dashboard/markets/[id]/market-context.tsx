"use client";
import { useGetMarketQuery } from "@/store/markets";
import type { Market } from "@/types/market";
import React, { createContext, useCallback, useContext } from "react";

interface MarketContextValue {
  market: Market | null;
  isLoading: boolean;
  fetchMarket: () => void;
  refetch: () => void;
}

const MarketContext = createContext<MarketContextValue | undefined>(undefined);

export function MarketProvider({ marketId, children }: { marketId: string; children: React.ReactNode }) {
  const {
    data: market,
    isLoading,
    error,
    refetch
  } = useGetMarketQuery(marketId);

  const fetchMarket = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <MarketContext.Provider value={{ market: market ?? null, isLoading, fetchMarket, refetch }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarketContext must be used within a MarketProvider");
  return ctx;
}
