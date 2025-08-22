"use client";

import ListPageHeader from "@/components/dashboard/ListPageHeader";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { AuditLog } from "@/types/audit-log";
import React, { useRef } from "react";


function getColumns(): ColumnDef<AuditLog>[] {
  return [
    {
      header: "S/N",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.user.first_name} {row.original.user.last_name}
          </div>
          <div className="text-sm text-muted-foreground">{row.original.user.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{row.original.user.role?.name?.toUpperCase() || "No Role"}</Badge>,
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => row.original.ip || "",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => row.original.action || "",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => row.original.created_at,
    },
  ]
}

export default function AuditLogs() {
  const dataTableRef = useRef<{ refresh: () => void }>(null)
  const columns = React.useMemo(() => getColumns(), [])

  return (
    <div>
      <ListPageHeader
        title="Audit Logs"
        description="Check audit logs"
      />
      <DataTable
        ref={dataTableRef}
        searchKey="search"
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchPlaceholder="Search log..."
        store="auditLogs"
        exportFileName="audit-logs.xlsx"
      />
    </div>
  )
}
