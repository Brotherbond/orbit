"use client"

import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleDelete } from "@/lib/handleDelete"
import { Location } from "@/types/location"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef } from "react"

function getColumns(
  router: any,
  refreshTable: () => void
): ColumnDef<Location>[] {
  return [
    {
      accessorKey: "street",
      header: "Street",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-[#444444]">{row.original.street}</div>
          <div className="text-sm text-[#ababab]">
            {row.original.city}, {row.original.state}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "full_location",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.full_location}>
          {row.original.full_location}
        </div>
      ),
    },
    {
      accessorKey: "markets",
      header: "Markets",
      cell: ({ row }) =>
        row.original.markets && row.original.markets.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.markets.map((m: any) => (
              <Badge key={m.uuid} variant="secondary">{m.name}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-[#ababab]">No Markets</span>
        ),
    },
    {
      accessorKey: "coordinates",
      header: "Coordinates",
      cell: ({ row }) => (
        <div className="text-sm text-[#ababab]">
          {row.original.latitude && row.original.longitude
            ? `${Number(row.original.longitude)?.toFixed(4)}, ${Number(row.original.latitude)?.toFixed(4)}`
            : "Not set"}
        </div>
      ),
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/locations/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/locations/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  storeName: "locations",
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

export default function LocationsPage() {
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null)

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(router, refreshTable),
    [router]
  )

  return (
    <div>
      <ListPageHeader
        title="Locations"
        description="Manage geographical locations and addresses"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/locations/create")}
        addLabel="Add Location"
      />

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search locations..."
        store="locations"
        exportFileName="Locations.xlsx"
      />
    </div>
  )
}
