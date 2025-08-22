"use client"

import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { useToast } from "@/hooks/use-toast"
import type { Vehicle } from "@/types/vehicle"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import BulkUploadModal from "@/components/dashboard/BulkUploadModal"
import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { handleDelete } from "@/lib/handleDelete"


export default function VehiclesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null);

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(session, router, toast),
    [session, router, toast]
  )

  // Filter config for vehicles
  const filters: import("@/components/ui/data-table").FilterConfig[] = []

  const [bulkOpen, setBulkOpen] = React.useState(false);

  return (
    <div>
      <ListPageHeader
        title="Vehicles"
        description="Manage and track all vehicles in the system"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/vehicles/create")}
        addLabel="Add Vehicle"
        showBulkAddButton={true}
        onBulkAdd={() => setBulkOpen(true)}
        bulkAddLabel="Add Bulk Vehicles"
      />
      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search vehicles..."
        store="vehicles"
        exportFileName="Vehicles.xlsx"
        filters={filters}
      />
      <BulkUploadModal
        title="Bulk Upload Vehicles"
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        label="Bulk Upload Vehicles"
        apiUrl="/vehicles/bulk-store"
        sampleUrl="/sample-vehicles.xlsx"
        onSuccess={refreshTable}
      />
    </div>
  )
}

export function getColumns(session: any, router: any, toast: any): ColumnDef<Vehicle>[] {
  return [
    {
      accessorKey: "vehicle_number",
      header: "Vehicle Number",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.vehicle_number}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      width: 100,
      cell: ({ row }) => <div className="text-sm">{row.original.type}</div>,
    },
    {
      accessorKey: "fuel_per_km",
      header: "Fuel per Km (L)",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.fuel_per_km}</div>,
    },
    {
      accessorKey: "height",
      header: "Height (m)",
      width: 120,
      cell: ({ row }) => <div className="text-sm">{row.original.height}</div>,
    },
    {
      accessorKey: "length",
      header: "Length (m)",
      width: 120,
      cell: ({ row }) => <div className="text-sm">{row.original.length}</div>,
    },
    {
      accessorKey: "width",
      header: "Width (m)",
      width: 120,
      cell: ({ row }) => <div className="text-sm">{row.original.width}</div>,
    },
    {
      accessorKey: "max_weight",
      header: "Max Weight (kg)",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.max_weight}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      width: 200,
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  storeName: "vehicles",
                  uuid: row.original.uuid
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
