import { Market } from "@/types/market";
import { createEntity } from "./entityFactory";

export const markets = createEntity<Market>({
  reducerPath: "marketsApi",
  entityEndpoint: "markets",
});
export const {
  useGetAllQuery: useGetMarketsQuery,
  useGetByIdQuery: useGetMarketQuery,
  useCreateMutation: useCreateMarketMutation,
  useUpdateMutation: useUpdateMarketMutation,
  useDeleteMutation: useDeleteMarketMutation,
} = markets;
