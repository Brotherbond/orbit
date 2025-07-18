import type { Brand } from "../types/brand";
import { createEntity } from "./entityFactory";

export const brands = createEntity<Brand>({
  reducerPath: "brandsApi",
  entityEndpoint: "brands",
});

export const {
  useGetAllQuery: useGetBrandsQuery,
  useGetByIdQuery: useGetBrandQuery,
  useCreateMutation: useCreateBrandMutation,
  useUpdateMutation: useUpdateBrandMutation,
  useDeleteMutation: useDeleteBrandMutation,
} = brands;
