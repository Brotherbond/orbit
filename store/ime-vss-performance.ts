import type { User } from "../types/user";
import { createEntity } from "./entityFactory";

export const imeVssPerformance = createEntity<User>({
  reducerPath: "imeVssApi",
  entityEndpoint: "users",
});

export const {
  useGetAllQuery: useGetIMEVSSsPerformanceQuery,
  useGetByIdQuery: useGetIMEVSSPerformanceQuery,
  useCreateMutation: useCreateIMEVSSPerformanceMutation,
  useUpdateMutation: useUpdateIMEVSSPerformanceMutation,
  useDeleteMutation: useDeleteIMEVSSPerformanceMutation,
} = imeVssPerformance;
