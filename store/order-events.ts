import type { OrderEvent } from "../types/order-event";
import { createEntity } from "./entityFactory";

export const orderEvents = createEntity<OrderEvent>({
  reducerPath: "orderEventsApi",
  entityEndpoint: "reports/order_events",
});

export const {
  useGetAllQuery: useGetOrderEventsQuery,
  useGetByIdQuery: useGetOrderEventQuery,
  useCreateMutation: useCreateOrderEventMutation,
  useUpdateMutation: useUpdateOrderEventMutation,
  useDeleteMutation: useDeleteOrderEventMutation,
} = orderEvents;
