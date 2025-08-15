"use client"

import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { useToast } from "@/hooks/use-toast"
import type { Delivery } from "@/types/delivery"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { handleDelete } from "@/lib/handleDelete"


export default function DeliveriesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null);

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(session, router, toast, refreshTable),
    [session, router, toast]
  )

  // Filter config for deliveries
  const filters: import("@/components/ui/data-table").FilterConfig[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Deliveries</h1>
          <p className="text-[#ababab]">Manage and track all deliveries in the system</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/deliveries/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Delivery
        </Button>
      </div>
      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search deliveries..."
        store="deliveries"
        exportFileName="Deliveries.xlsx"
        filters={filters}
      />
    </div>
  )
}

export function getColumns(session: any, router: any, toast: any, refreshTable: () => void): ColumnDef<Delivery>[] {
  return [
    {
      accessorKey: "order.ref",
      header: "Order Ref",
      cell: ({ row }) => <div className="text-sm">{row.original.order?.ref}</div>,
    },
    {
      accessorKey: "vehicle.type",
      header: "Vehicle Type",
      cell: ({ row }) => <div className="text-sm">{row.original.vehicle?.type}</div>,
    },
    {
      accessorKey: "distance",
      header: "Distance (km)",
      cell: ({ row }) => <div className="text-sm">{row.original.distance}</div>,
    },
    {
      accessorKey: "cost_ratio",
      header: "Cost Ratio",
      cell: ({ row }) => <div className="text-sm">{row.original.cost_ratio}</div>,
    },
    {
      accessorKey: "delivery_burn_rate",
      header: "Burn Rate",
      cell: ({ row }) => <div className="text-sm">{row.original.delivery_burn_rate}</div>,
    },
    {
      accessorKey: "total_order_volume",
      header: "Order Volume (m³)",
      cell: ({ row }) => <div className="text-sm">{row.original.total_order_volume}</div>,
    },
    {
      accessorKey: "total_order_weight",
      header: "Order Weight (kg)",
      cell: ({ row }) => <div className="text-sm">{row.original.total_order_weight}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => row.original.created_at,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/deliveries/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/deliveries/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  entity: "delivery",
                  uuid: row.original.uuid,
                  endpoint: "/deliveries",
                })
              }
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

/* handleDelete is now replaced by handleDelete utility */
