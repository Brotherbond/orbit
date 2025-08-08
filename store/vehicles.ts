import { Vehicle } from "@/types/vehicle";
import { createEntity } from "./entityFactory";

export const vehicles = createEntity<Vehicle>({
  reducerPath: "vehiclesApi",
  entityEndpoint: "vehicles",
});

export const {
  useGetAllQuery: useGetVehiclesQuery,
  useGetByIdQuery: useGetVehicleQuery,
  useCreateMutation: useCreateVehicleMutation,
  useUpdateMutation: useUpdateVehicleMutation,
  useDeleteMutation: useDeleteVehicleMutation,
} = vehicles;
