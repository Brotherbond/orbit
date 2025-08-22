"use client";
import BulkUploadModal from "@/components/dashboard/BulkUploadModal";
import ListPageHeader from "@/components/dashboard/ListPageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { handleDelete } from "@/lib/handleDelete";
import type { Warehouse } from "@/types/warehouse";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";


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
    () => getColumns(router, refreshTable),
    [router]
  )

  // Filter config for warehouses
  const filters: import("@/components/ui/data-table").FilterConfig[] = []

  return (
    <div>
      <ListPageHeader
        title="Warehouses"
        description="Manage and track all warehouses in the system"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/warehouses/create")}
        addLabel="Add Warehouse"
        showBulkAddButton={true}
        onBulkAdd={() => setBulkOpen(true)}
        bulkAddLabel="Add Bulk Warehouses"
      />
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

export function getColumns(router: any, refreshTable: () => void): ColumnDef<Warehouse>[] {
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
                  storeName: "warehouses",
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
