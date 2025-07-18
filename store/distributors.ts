import type { Distributor } from "../types/distributor";
import { createEntity } from "./entityFactory";

export const distributors = createEntity<Distributor>({
  reducerPath: "distributorsApi",
  entityEndpoint: "distributors",
});

export const {
  useGetAllQuery: useGetDistributorsQuery,
  useGetByIdQuery: useGetDistributorQuery,
  useCreateMutation: useCreateDistributorMutation,
  useUpdateMutation: useUpdateDistributorMutation,
  useDeleteMutation: useDeleteDistributorMutation,
} = distributors;
