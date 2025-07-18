import { configureStore } from "@reduxjs/toolkit";
import { brands, useGetBrandsQuery } from "@/store/brands";
import { distributors, useGetDistributorsQuery } from "@/store/distributors";
import { imeVss, useGetIMEVSSsQuery } from "@/store/ime-vss";
import { orders, useGetOrdersQuery } from "@/store/orders";
import { users, useGetUsersQuery } from "./users";


export const store = configureStore({
  reducer: {
    [orders.reducerPath]: orders.reducer,
    [brands.reducerPath]: brands.reducer,
    [distributors.reducerPath]: distributors.reducer,
    [users.reducerPath]: users.reducer,
    [imeVss.reducerPath]: imeVss.reducer,
  } as any,
  middleware: (getDefaultMiddleware) =>
    (getDefaultMiddleware() as any).concat([
      orders.middleware,
      brands.middleware,
      distributors.middleware,
      users.middleware,
      imeVss.middleware,
    ]) as any,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const storeHooks = {
  orders: useGetOrdersQuery,
  brands: useGetBrandsQuery,
  distributors: useGetDistributorsQuery,
  imeVss: useGetIMEVSSsQuery,
  users: useGetUsersQuery,
};
