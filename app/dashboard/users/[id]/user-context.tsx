"use client";
import { useGetUserQuery } from "@/store/users";
import type { User } from "@/types/user";
import React, { createContext, useCallback, useContext } from "react";

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => void;
  refetch: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useGetUserQuery(userId);

  const fetchUser = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <UserContext.Provider value={{ user: user ?? null, isLoading, fetchUser, refetch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within a UserProvider");
  return ctx;
}
