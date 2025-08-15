import { Delivery } from "@/types/delivery";
import { createEntity } from "./entityFactory";

export const deliveries = createEntity<Delivery>({
  reducerPath: "deliveriesApi",
  entityEndpoint: "deliveries",
});

export const {
  useGetAllQuery: useGetDeliveriesQuery,
  useGetByIdQuery: useGetDeliveryQuery,
  useCreateMutation: useCreateDeliveryMutation,
  useUpdateMutation: useUpdateDeliveryMutation,
  useDeleteMutation: useDeleteDeliveryMutation,
} = deliveries;
