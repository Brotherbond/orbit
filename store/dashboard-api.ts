import { DashboardData } from "@/types/dashboard";
import { createEntity } from "./entityFactory";

export const dashboardApi = createEntity<DashboardData>({
  reducerPath: "dashboardApi",
  entityEndpoint: "admin/dashboard/sales-admin",
});

export const { useGetSingleQuery: useGetDashboardQuery } = dashboardApi;
