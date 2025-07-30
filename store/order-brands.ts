import { OrderBrand } from "@/types/order";
import { createEntity } from "./entityFactory";

export const orderBrands = createEntity<OrderBrand>({
  reducerPath: "orderBrandsApi",
  entityEndpoint: "reports/brands",
});

export const {
  useGetAllQuery: useGetOrderBrandsQuery,
  useGetByIdQuery: useGetOrderBrandQuery,
  useCreateMutation: useCreateOrderBrandMutation,
  useUpdateMutation: useUpdateOrderBrandMutation,
  useDeleteMutation: useDeleteOrderBrandMutation,
} = orderBrands;
