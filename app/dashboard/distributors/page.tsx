"use client"

import BulkUploadModal from "@/components/dashboard/BulkUploadModal"
import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleDelete } from "@/lib/handleDelete"
import { Distributor } from "@/types/distributor"
import { Edit, Eye, MoreHorizontal, Trash2, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"


function getColumns(
  router: any,
  refreshTable: () => void
): ColumnDef<Distributor>[] {
  return [
    {
      accessorKey: "business_name",
      header: "Business",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.business_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.user.first_name} {row.original.user.last_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.email",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <div className="text-sm">{row.original.user.email}</div>
          <div className="text-sm text-muted-foreground">{row.original.user.phone}</div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.address}>
          {row.original.address}
        </div>
      ),
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const perf = row.original.performance
        if (!perf) return <span className="text-muted-foreground">No data</span>
        return (
          <div className="text-sm">
            <div className="font-medium">₦{perf.total_value.toLocaleString()}</div>
            <div className="text-muted-foreground">{perf.total_orders} orders</div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {perf.growth_rate}%
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "user.status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.user.status === "active" ? "default" : "destructive"}
          className={`status ${row.original.user.status === "active" ? "active" : "inactive"}`}
        >
          {row.original.user.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.user.uuid}/orders`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  storeName: "distributors",
                  uuid: row.original.uuid,
                  onSuccess: refreshTable,
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

export default function DistributorsPage() {
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null)

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(router, refreshTable),
    [router]
  )

  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const filters: import("@/components/ui/data-table").FilterConfig[] = [
    {
      type: "select",
      label: "IME/VSS",
      param: "ime_vss",
      options: [
        { label: "All", value: "" },
        { label: "IME", value: "ime" },
        { label: "VSS", value: "vss" },
      ],
    },
    {
      type: "select",
      label: "Status",
      param: "status",
      options: [
        { label: "All", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]

  return (
    <div>
      <ListPageHeader
        title="Distributors"
        description="Manage distributors and their business information"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/distributors/create")}
        addLabel="Add Distributor"
        showBulkAddButton={true}
        onBulkAdd={() => setBulkModalOpen(true)}
        bulkAddLabel="Add Bulk Distributors"
      />

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="business_name"
        searchPlaceholder="Search distributors..."
        store="distributors"
        exportFileName="Distributors.xlsx"
        filters={filters}
      />

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        sampleUrl="/sample-distributors.xlsx"
        apiUrl="/distributors/bulk-store"
        onSuccess={refreshTable}
        title="Bulk Distributors Upload"
        label="Upload Bulk Distributors (.xlsx)"
      />
    </div>
  )
}
