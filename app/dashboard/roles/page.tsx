"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Role } from "@/types/role"


export default function RolesPage() {
  const router = useRouter()
  const { toast } = useToast()

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name.charAt(0).toUpperCase() + row.original.name.slice(1).toLowerCase()}</div>
          <div className="text-sm text-muted-foreground">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description,
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/roles/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/roles/${row.original.uuid}/edit`)}>
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


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      await apiClient.delete(`/roles/${id}`)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Roles</h1>
          <p className="text-[#ababab]">Manage system roles and permissions</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/roles/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search roles..."
        url="/roles"
        exportFileName="Roles.xlsx"
      />
    </div>
  )
}
