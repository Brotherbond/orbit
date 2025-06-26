"use client"

import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Location } from "@/types/location"

function getColumns(
  router: any,
  toast: any,
  refreshTable: () => void
): ColumnDef<Location>[] {
  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      await apiClient.delete(`/locations/${uuid}`)
      toast({
        title: "Success",
        description: "Location deleted successfully",
      })
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      })
    }
  }

  return [
    {
      accessorKey: "name",
      header: "Location Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-[#444444]">{row.original.name}</div>
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
            ? `${row.original.latitude.toFixed(4)}, ${row.original.longitude.toFixed(4)}`
            : "Not set"}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
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
            <DropdownMenuItem onClick={() => handleDelete(row.original.uuid)} className="text-red-600">
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
  const { toast } = useToast()
  const dataTableRef = useRef<{ refresh: () => void }>(null)

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(router, toast, refreshTable),
    [router, toast]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Locations</h1>
          <p className="text-[#ababab]">Manage geographical locations and addresses</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/locations/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search locations..."
        url="/locations"
        exportFileName="locations.xlsx"
      />
    </div>
  )
}
