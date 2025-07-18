"use client"

import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Package } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Brand } from "@/types/brand"
export default function BrandsPage() {
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
          <h1 className="text-3xl font-bold text-[#444444]">Brands</h1>
          <p className="text-[#ababab]">Manage product brands and their packages</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/brands/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search brands..."
        store="brands"
        exportFileName="Brands.xlsx"
      />
    </div>
  )
}

function getColumns(
  router: any,
  toast: any,
  refreshTable: () => void
): ColumnDef<Brand>[] {
  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return

    try {
      await apiClient.delete(`/brands/${uuid}`)
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      })
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      })
    }
  }

  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="w-12 h-12 relative">
          <Image
            src={row.original.image || "/placeholder.svg"}
            alt={row.original.name}
            fill
            className="object-cover rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=48&width=48&text=Brand"
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Brand Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.category}</div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: "packages",
      header: "Packages",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.packages?.length || 0} packages</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            ₦{(Number(row.original.packages?.[0]?.og_price ?? 0) / (row.original.packages?.[0]?.quantity ?? 1)).toFixed(2).toLocaleString() ?? 'N/A'}
          </div>
        )
      },
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/brands/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/brands/${row.original.uuid}/edit`)}>
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
