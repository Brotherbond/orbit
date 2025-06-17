"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface OrderBrand {
  id: string
  brand: {
    name: string
    category: string
  }
  quantity: string
  price: number
}

interface Order {
  id: string
  uuid: string
  distributor: {
    business_name: string
    user: {
      first_name: string
      last_name: string
    }
  }
  sales_exec: {
    first_name: string
    last_name: string
  }
  total_amount: number
  status: string
  brands: OrderBrand[]
  created_at: string
  updated_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <div className="font-mono text-sm">#{row.original.id}</div>,
    },
    {
      accessorKey: "distributor",
      header: "Distributor",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.distributor.business_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.distributor.user.first_name} {row.original.distributor.user.last_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "sales_exec",
      header: "Sales Executive",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.sales_exec.first_name} {row.original.sales_exec.last_name}
        </div>
      ),
    },
    {
      accessorKey: "brands",
      header: "Items",
      cell: ({ row }) => <div className="text-sm">{row.original.brands?.length || 0} items</div>,
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => <div className="font-medium">₦{row.original.total_amount.toLocaleString()}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        let variant: "default" | "secondary" | "destructive" = "secondary"
        let className = ""

        switch (status) {
          case "confirmed":
            variant = "default"
            className = "status-active"
            break
          case "pending":
            className = "status-pending"
            break
          case "delivered":
            variant = "default"
            className = "bg-blue-500 hover:bg-blue-600"
            break
          case "cancelled":
            variant = "destructive"
            className = "status-inactive"
            break
        }

        return (
          <Badge variant={variant} className={className}>
            {status}
          </Badge>
        )
      },
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${row.original.uuid}/messages`)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchOrders()
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/orders?page=${pagination.pageIndex + 1}&per_page=${pagination.pageSize}`)

      if (response.data.status === "success") {
        setOrders(response.data.data.items)
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
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }))
  }

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Orders</h1>
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
          <h1 className="text-3xl font-bold text-[#444444]">Orders</h1>
          <p className="text-[#ababab]">Manage and track all orders in the system</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/orders/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchKey="id"
        searchPlaceholder="Search orders..."
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
