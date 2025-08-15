import { IMEVSSPerformance } from "@/types/ime-vss-performance";
import { createEntity } from "./entityFactory";

export const imeVssPerformance = createEntity<IMEVSSPerformance>({
  reducerPath: "imeVssPerformanceApi",
  entityEndpoint: "reports/ime_vss_performance",
});

export const {
  useGetAllQuery: useGetIMEVSSsPerformanceQuery,
  useGetByIdQuery: useGetIMEVSSPerformanceQuery,
  useCreateMutation: useCreateIMEVSSPerformanceMutation,
  useUpdateMutation: useUpdateIMEVSSPerformanceMutation,
  useDeleteMutation: useDeleteIMEVSSPerformanceMutation,
} = imeVssPerformance;
