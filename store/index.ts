import { configureStore } from "@reduxjs/toolkit";
import { brands, useGetBrandsQuery } from "@/store/brands";
import { distributors, useGetDistributorsQuery } from "@/store/distributors";
import { imeVss, useGetIMEVSSsQuery } from "@/store/ime-vss";
import { orders, useGetOrdersQuery } from "@/store/orders";
import { users, useGetUsersQuery } from "./users";
import {
  distributorOrders,
  useGetDistributorOrdersQuery,
} from "./distributor-orders";
import { auditLogs, useGetAuditLogsQuery } from "./audit-logs";
import {
  distributorTargets,
  useGetDistributorTargetsQuery,
} from "./distributor-targets";
import { dashboardApi } from "./dashboard-api";
import dashboardFiltersReducer from "./dashboard-filters";
import { locations, useGetLocationsQuery } from "./locations";
import { markets, useGetMarketsQuery } from "./markets";
import { roles, useGetRolesQuery } from "./roles";
import { settings, useGetSettingsQuery } from "./settings";
import { orderBrands, useGetOrderBrandsQuery } from "./order-brands";
import { orderEvents, useGetOrderEventsQuery } from "./order-events";
import {
  imeVssPerformance,
  useGetIMEVSSsPerformanceQuery,
} from "./ime-vss-performance";

export const store = configureStore({
  reducer: {
    [auditLogs.reducerPath]: auditLogs.reducer,
    [brands.reducerPath]: brands.reducer,
    [distributors.reducerPath]: distributors.reducer,
    [distributorOrders.reducerPath]: distributorOrders.reducer,
    [distributorTargets.reducerPath]: distributorTargets.reducer,
    [imeVss.reducerPath]: imeVss.reducer,
    [imeVssPerformance.reducerPath]: imeVssPerformance.reducer,
    [locations.reducerPath]: locations.reducer,
    [markets.reducerPath]: markets.reducer,
    [orders.reducerPath]: orders.reducer,
    [orderBrands.reducerPath]: orderBrands.reducer,
    [orderEvents.reducerPath]: orderEvents.reducer,
    [roles.reducerPath]: roles.reducer,
    [settings.reducerPath]: settings.reducer,
    [users.reducerPath]: users.reducer,
    dashboardFilters: dashboardFiltersReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  } as any,
  middleware: (getDefaultMiddleware) =>
    (getDefaultMiddleware() as any).concat([
      auditLogs.middleware,
      brands.middleware,
      distributors.middleware,
      distributorOrders.middleware,
      distributorTargets.middleware,
      imeVss.middleware,
      imeVssPerformance.middleware,
      locations.middleware,
      markets.middleware,
      orders.middleware,
      orderBrands.middleware,
      orderEvents.middleware,
      roles.middleware,
      settings.middleware,
      users.middleware,
      dashboardApi.middleware,
    ]) as any,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const storeHooks = {
  auditLogs: useGetAuditLogsQuery,
  brands: useGetBrandsQuery,
  distributors: useGetDistributorsQuery,
  distributorOrders: useGetDistributorOrdersQuery,
  distributorTargets: useGetDistributorTargetsQuery,
  imeVss: useGetIMEVSSsQuery,
  imeVssPerformance: useGetIMEVSSsPerformanceQuery,
  locations: useGetLocationsQuery,
  markets: useGetMarketsQuery,
  orders: useGetOrdersQuery,
  orderBrands: useGetOrderBrandsQuery,
  orderEvents: useGetOrderEventsQuery,
  roles: useGetRolesQuery,
  settings: useGetSettingsQuery,
  users: useGetUsersQuery,
};

export const storeApis = {
  auditLogs,
  brands,
  distributors,
  distributorOrders,
  distributorTargets,
  imeVss,
  imeVssPerformance,
  locations,
  markets,
  orders,
  orderBrands,
  orderEvents,
  roles,
  settings,
  users,
};
