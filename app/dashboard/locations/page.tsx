"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Location {
  id: string
  uuid: string
  name: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  latitude: number
  longitude: number
  market: {
    id: string
    name: string
  }
  status: string
  created_at: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Location>[] = [
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
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.address}>
          {row.original.address}
        </div>
      ),
    },
    {
      accessorKey: "market",
      header: "Market",
      cell: ({ row }) => <Badge variant="secondary">{row.original.market?.name || "No Market"}</Badge>,
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "default" : "destructive"}
          className={row.original.status === "active" ? "status-active" : "status-inactive"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
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

  useEffect(() => {
    fetchLocations()
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(
        `/locations?page=${pagination.pageIndex + 1}&per_page=${pagination.pageSize}`,
      )

      if (response.data.status === "success") {
        setLocations(response.data.data.items)
        if (response.data.meta.pagination) {
          setPagination((prev) => ({
            ...prev,
            pageCount: response.data.meta.pagination.totalPages,
            total: response.data.meta.pagination.total,
          }))
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      await apiClient.delete(`/locations/${uuid}`)
      toast({
        title: "Success",
        description: "Location deleted successfully",
      })
      fetchLocations()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }))
  }

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
  }

  if (isLoading && locations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Locations</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

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
        columns={columns}
        data={locations}
        searchKey="name"
        searchPlaceholder="Search locations..."
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  )
}
