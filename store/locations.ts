import { Location } from "@/types/location";
import { createEntity } from "./entityFactory";

export const locations = createEntity<Location>({
  reducerPath: "locationsApi",
  entityEndpoint: "locations",
});
export const {
  useGetAllQuery: useGetLocationsQuery,
  useGetByIdQuery: useGetLocationQuery,
  useCreateMutation: useCreateLocationMutation,
  useUpdateMutation: useUpdateLocationMutation,
  useDeleteMutation: useDeleteLocationMutation,
} = locations;
