"use client";
import { useGetRoleQuery } from "@/store/roles";
import type { Role } from "@/types/role";
import React, { createContext, useCallback, useContext } from "react";

interface RoleContextValue {
  role: Role | null;
  isLoading: boolean;
  fetchRole: () => void;
  refetch: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ roleId, children }: { roleId: string; children: React.ReactNode }) {
  const {
    data: role,
    isLoading,
    error,
    refetch
  } = useGetRoleQuery(roleId);

  const fetchRole = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <RoleContext.Provider value={{ role: role ?? null, isLoading, fetchRole, refetch }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRoleContext must be used within a RoleProvider");
  return ctx;
}
