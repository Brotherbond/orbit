"use client";
import { useGetSettingQuery } from "@/store/settings";
import type { Setting } from "@/types/setting";
import React, { createContext, useCallback, useContext } from "react";

interface SettingContextValue {
  setting: Setting | null;
  isLoading: boolean;
  fetchSetting: () => void;
  refetch: () => void;
}

const SettingContext = createContext<SettingContextValue | undefined>(undefined);

export function SettingProvider({ settingId, children }: { settingId: string; children: React.ReactNode }) {
  const {
    data: setting,
    isLoading,
    error,
    refetch
  } = useGetSettingQuery(settingId);

  const fetchSetting = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SettingContext.Provider value={{ setting: setting ?? null, isLoading, fetchSetting, refetch }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettingContext() {
  const ctx = useContext(SettingContext);
  if (!ctx) throw new Error("useSettingContext must be used within a SettingProvider");
  return ctx;
}
