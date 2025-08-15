import { Warehouse } from "@/types/warehouse";
import { createEntity } from "./entityFactory";

export const warehouses = createEntity<Warehouse>({
  reducerPath: "warehousesApi",
  entityEndpoint: "warehouses",
});

export const {
  useGetAllQuery: useGetWarehousesQuery,
  useGetByIdQuery: useGetWarehouseQuery,
  useCreateMutation: useCreateWarehouseMutation,
  useUpdateMutation: useUpdateWarehouseMutation,
  useDeleteMutation: useDeleteWarehouseMutation,
} = warehouses;
