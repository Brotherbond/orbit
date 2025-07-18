import type { Order } from "../types/order";
import { createEntity } from "./entityFactory";

export const orders = createEntity<Order>({
  reducerPath: "ordersApi",
  entityEndpoint: "orders",
});

export const {
  useGetAllQuery: useGetOrdersQuery,
  useGetByIdQuery: useGetOrderQuery,
  useCreateMutation: useCreateOrderMutation,
  useUpdateMutation: useUpdateOrderMutation,
  useDeleteMutation: useDeleteOrderMutation,
} = orders;
