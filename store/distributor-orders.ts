import { Order } from "@/types/order";
import { createEntity } from "./entityFactory";

export const distributorOrders = createEntity<Order>({
  reducerPath: "distributorOrdersApi",
  entityEndpoint: "distributors/:id/orders",
});
export const {
  useGetAllQuery: useGetDistributorOrdersQuery,
  useGetByIdQuery: useGetDistributorOrderQuery,
  useCreateMutation: useCreateDistributorOrderMutation,
  useUpdateMutation: useUpdateDistributorOrderMutation,
  useDeleteMutation: useDeleteDistributorOrderMutation,
} = distributorOrders;
