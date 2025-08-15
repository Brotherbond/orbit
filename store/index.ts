import { brands } from "@/store/brands";
import { distributors } from "@/store/distributors";
import { imeVss } from "@/store/ime-vss";
import { orders } from "@/store/orders";
import { configureStore } from "@reduxjs/toolkit";
import { auditLogs } from "./audit-logs";
import { dashboardApi } from "./dashboard-api";
import dashboardFiltersReducer from "./dashboard-filters";
import { deliveries } from "./deliveries";
import { distributorOrders } from "./distributor-orders";
import { distributorTargets } from "./distributor-targets";
import { imeVssPerformance } from "./ime-vss-performance";
import { locations } from "./locations";
import { markets } from "./markets";
import { orderBrands } from "./order-brands";
import { orderEvents } from "./order-events";
import { roles } from "./roles";
import { settings } from "./settings";
import { users } from "./users";
import { vehicles } from "./vehicles";
import { warehouses } from "./warehouses";

export const store = configureStore({
  reducer: {
    [auditLogs.reducerPath]: auditLogs.reducer,
    [brands.reducerPath]: brands.reducer,
    [deliveries.reducerPath]: deliveries.reducer,
    [distributors.reducerPath]: distributors.reducer,
    [distributorOrders.reducerPath]: distributorOrders.reducer,
    [distributorTargets.reducerPath]: distributorTargets.reducer,
    [imeVss.reducerPath]: imeVss.reducer,
    [imeVssPerformance.reducerPath]: imeVssPerformance.reducer,
    [locations.reducerPath]: locations.reducer,
    [markets.reducerPath]: markets.reducer,
    [vehicles.reducerPath]: vehicles.reducer,
    [warehouses.reducerPath]: warehouses.reducer,
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
      deliveries.middleware,
      distributors.middleware,
      distributorOrders.middleware,
      distributorTargets.middleware,
      imeVss.middleware,
      imeVssPerformance.middleware,
      locations.middleware,
      markets.middleware,
      vehicles.middleware,
      warehouses.middleware,
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
export const storeApis = {
  auditLogs,
  brands,
  deliveries,
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
  vehicles,
  warehouses,
  users,
};
