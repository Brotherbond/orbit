"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { useToast } from "@/hooks/use-toast";
import type { Warehouse } from "@/types/warehouse";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { handleDelete } from "@/lib/handleDelete";
import BulkUploadModal from "@/components/dashboard/BulkUploadModal";


export default function WarehousesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const dataTableRef = useRef<{ refresh: () => void }>(null);

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(session, router, toast, refreshTable),
    [session, router, toast]
  )

  // Filter config for warehouses
  const filters: import("@/components/ui/data-table").FilterConfig[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Warehouses</h1>
          <p className="text-[#ababab]">Manage and track all warehouses in the system</p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-primary" onClick={() => setBulkOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bulk Warehouses
          </Button>
          <Button className="btn-primary" onClick={() => router.push("/dashboard/warehouses/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </div>
      </div>
      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search warehouses..."
        store="warehouses"
        exportFileName="Warehouses.xlsx"
        filters={filters}
      />
      <BulkUploadModal
        title="Bulk Upload Warehouses"
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        label="Bulk Upload Warehouses"
        apiUrl="/warehouses/bulk-store"
        sampleUrl="/sample-warehouses.xlsx"
        onSuccess={refreshTable}
      />
    </div>
  )
}

export function getColumns(session: any, router: any, toast: any, refreshTable: () => void): ColumnDef<Warehouse>[] {
  return [
    {
      accessorKey: "warehouse_code",
      header: "Warehouse Code",
      cell: ({ row }) => <div className="text-sm">{row.original.warehouse_code}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <div className="text-sm">{row.original.address}</div>,
    },
    {
      accessorKey: "location.name",
      header: "Location",
      cell: ({ row }) => <div className="text-sm">{row.original.location?.full_location}</div>,
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: ({ row }) => <div className="text-sm">{row.original.longitude}</div>,
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: ({ row }) => <div className="text-sm">{row.original.latitude}</div>,
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/warehouses/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/warehouses/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  entity: "warehouse",
                  uuid: row.original.uuid,
                  endpoint: "/warehouses",
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
