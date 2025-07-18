import { AuditLog } from "@/types/audit-log";
import { createEntity } from "./entityFactory";

export const auditLogs = createEntity<AuditLog>({
  reducerPath: "auditLogsApi",
  entityEndpoint: "audit-logs",
});

export const {
  useGetAllQuery: useGetAuditLogsQuery,
  useGetByIdQuery: useGetAuditLogQuery,
  useCreateMutation: useCreateAuditLogMutation,
  useUpdateMutation: useUpdateAuditLogMutation,
  useDeleteMutation: useDeleteAuditLogMutation,
} = auditLogs;
