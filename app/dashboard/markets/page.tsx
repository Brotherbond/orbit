"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, MapPin, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Market } from "@/types/market"


export default function MarketsPage() {
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
      accessorKey: "users_count",
      header: "Users",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-[#ababab]" />
          <span className="text-[#444444]">{row.original.users_count || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "location.full_location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-[#ababab]" />
          <span className="text-[#444444]">{row.original.location?.full_location || "—"}</span>
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


  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this market?")) return

    try {
      await apiClient.delete(`/markets/${uuid}`)
      router.refresh()
      toast({
        title: "Success",
        description: "Market deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete market",
        variant: "destructive",
      })
    }
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
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search markets..."
        url="/markets"
        exportFileName="Markets.xlsx"
      />
    </div>
  )
}
