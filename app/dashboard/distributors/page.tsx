"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Distributor {
  id: string
  uuid: string
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string
    status: string
  }
  business_name: string
  address: string
  performance?: {
    total_orders: number
    total_value: number
    growth_rate: number
  }
  created_at: string
}

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Distributor>[] = [
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
          className={row.original.user.status === "active" ? "status-active" : "status-inactive"}
        >
          {row.original.user.status}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/distributors/${row.original.uuid}/orders`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Orders
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
    fetchDistributors()
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchDistributors = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(
        `/distributors?page=${pagination.pageIndex + 1}&per_page=${pagination.pageSize}`,
      )

      if (response.data.status === "success") {
        setDistributors(response.data.data.items)
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
        description: "Failed to fetch distributors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this distributor?")) return

    try {
      await apiClient.delete(`/distributors/${uuid}`)
      toast({
        title: "Success",
        description: "Distributor deleted successfully",
      })
      fetchDistributors()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete distributor",
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

  if (isLoading && distributors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Distributors</h1>
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
          <h1 className="text-3xl font-bold text-[#444444]">Distributors</h1>
          <p className="text-[#ababab]">Manage distributors and their business information</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/distributors/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Distributor
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={distributors}
        searchKey="business_name"
        searchPlaceholder="Search distributors..."
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
