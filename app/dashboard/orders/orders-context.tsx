import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import type { Order } from "@/types/order";

interface OrdersContextValue {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  updateOrder: (updatedOrder: Order) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastFetchedRef = useRef<number>(0);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ items: Order[] }>("/orders?limit=1000");
      setOrders(response.data.items ?? []);
      lastFetchedRef.current = Date.now();
    } catch (error) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch every X ms (default 5 mins or as specified in env)
  const refetchInterval = React.useMemo(() => {
    return typeof process.env.NEXT_PUBLIC_ORDERS_REFETCH_INTERVAL_MS_IN_MINUTES === "string"
      ? parseInt(process.env.NEXT_PUBLIC_ORDERS_REFETCH_INTERVAL_MS_IN_MINUTES, 10) * 60 * 1000
      : 900000; // 15 mins default
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, refetchInterval);
    return () => clearInterval(interval);
  }, [fetchOrders,refetchInterval]);

  // Avoid unnecessary fetches within the interval
  const maybeFetchOrders = useCallback((): Promise<void> => {
    if (Date.now() - lastFetchedRef.current > refetchInterval) {
      return fetchOrders();
    }
    return Promise.resolve();
  }, [fetchOrders, refetchInterval]);

  // Update a specific order locally
  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev =>
      prev.map(order => (order.uuid === updatedOrder.uuid ? updatedOrder : order))
    );
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, isLoading, fetchOrders: maybeFetchOrders, updateOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrdersContext must be used within an OrdersProvider");
  return ctx;
}
