"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, MapPin, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Market {
  id: string
  uuid: string
  name: string
  description: string
  region: string
  status: string
  user_count: number
  location_count: number
  created_at: string
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Market>[] = [
    {
      accessorKey: "name",
      header: "Market Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-[#444444]">{row.original.name}</div>
          <div className="text-sm text-[#ababab]">{row.original.region}</div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.original.description}>
          {row.original.description || "No description"}
        </div>
      ),
    },
    {
      accessorKey: "user_count",
      header: "Users",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-[#ababab]" />
          <span className="text-[#444444]">{row.original.user_count || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "location_count",
      header: "Locations",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-[#ababab]" />
          <span className="text-[#444444]">{row.original.location_count || 0}</span>
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/markets/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/markets/${row.original.uuid}/edit`)}>
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
    fetchMarkets()
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchMarkets = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/markets?page=${pagination.pageIndex + 1}&per_page=${pagination.pageSize}`)

      if (response.data.status === "success") {
        setMarkets(response.data.data.items)
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
        description: "Failed to fetch markets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this market?")) return

    try {
      await apiClient.delete(`/markets/${uuid}`)
      toast({
        title: "Success",
        description: "Market deleted successfully",
      })
      fetchMarkets()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete market",
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

  if (isLoading && markets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Markets</h1>
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
          <h1 className="text-3xl font-bold text-[#444444]">Markets</h1>
          <p className="text-[#ababab]">Manage market regions and territories</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/markets/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Market
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={markets}
        searchKey="name"
        searchPlaceholder="Search markets..."
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
