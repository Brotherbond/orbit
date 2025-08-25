"use client"

import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { ORDER_FILTERS } from "@/lib/filters/orders"
import { useOrderColumns } from "@/hooks/useOrderColumns"
import { useMemo } from "react"

export default function OrdersPage() {
  const { columns } = useOrderColumns()
  
  const filters = useMemo(() => ORDER_FILTERS, [])

  return (
    <div>
      <ListPageHeader
        title="Orders"
        description="Manage and track all orders in the system"
      />
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        store="orders"
        exportFileName="Orders.xlsx"
        filters={filters}
      />
    </div>
  )
}
