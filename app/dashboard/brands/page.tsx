"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Package } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface BrandPackage {
  id: string
  type: string
  quantity: number
  wholesale_price: number
  retail_price: number
  retail_price_with_markup: number
}

interface Brand {
  id: string
  uuid: string
  name: string
  category: string
  image: string
  packages: BrandPackage[]
  created_at: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    total: 0,
  })

  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Brand>[] = [
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
      accessorKey: "price_range",
      header: "Price Range",
      cell: ({ row }) => {
        const packages = row.original.packages || []
        if (packages.length === 0) return <span className="text-muted-foreground">No pricing</span>

        const prices = packages.map((p) => p.retail_price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return (
          <div className="text-sm">
            ₦{minPrice.toLocaleString()} - ₦{maxPrice.toLocaleString()}
          </div>
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

  useEffect(() => {
    fetchBrands()
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchBrands = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/brands?page=${pagination.pageIndex + 1}&per_page=${pagination.pageSize}`)

      if (response.data.status === "success") {
        setBrands(response.data.data.items)
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
        description: "Failed to fetch brands",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return

    try {
      await apiClient.delete(`/brands/${uuid}`)
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      })
      fetchBrands()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete brand",
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

  if (isLoading && brands.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Brands</h1>
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
          <h1 className="text-3xl font-bold text-[#444444]">Brands</h1>
          <p className="text-[#ababab]">Manage product brands and their packages</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/brands/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={brands}
        searchKey="name"
        searchPlaceholder="Search brands..."
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
