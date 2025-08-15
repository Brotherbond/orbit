import { apiClient } from "@/lib/api-client";
import { Role } from "@/types/role";
import React, { createContext, useContext, useEffect, useState } from "react";

type RolesContextType = {
  roles: Role[];
  isLoading: boolean;
  refreshRoles: () => void;
};

const RolesContext = createContext<RolesContextType>({
  roles: [],
  isLoading: false,
  refreshRoles: () => { },
});

export const RolesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<{ items: Role[] }>("/roles", { showToast: false });
      setRoles(data.items || []);
    } catch {
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ roles, isLoading, refreshRoles: fetchRoles }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
