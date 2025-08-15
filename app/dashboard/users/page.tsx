"use client";
import BulkUploadModal from "@/components/dashboard/BulkUploadModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/user";
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const roles = "super-admin,sales-admin,manager,operations,treasury"

function getColumns(
  router: any,
  toast: any,
  refreshTable: () => void
): ColumnDef<User>[] {
  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await apiClient.delete(`/users/${uuid}`)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  return [
    {
      accessorKey: "first_name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{row.original.role?.name?.toUpperCase() || "No Role"}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "default" : "destructive"}
          className={`status ${row.original.status === "active" ? "active" : "inactive"}`}
        >
          {row.original.status}
        </Badge>
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/users/${row.original.uuid}/edit`)}>
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

export default function UsersPage() {
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

  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Users</h1>
          <p className="text-[#ababab]">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-primary" onClick={() => setBulkModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bulk Users
          </Button>
          <Button className="btn-primary" onClick={() => router.push("/dashboard/users/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="first_name"
        searchPlaceholder="Search users..."
        store="users"
        exportFileName="Users.xlsx"
        filters={[
          {
            type: "select",
            label: "Role",
            param: "roles",
            options: [
              { label: "All Roles", value: roles },
              { label: "Manager", value: "manager" },
              { label: "Operations", value: "operations" },
              { label: "Sales Admin", value: "sales-admin" },
              { label: "Super Admin", value: "super-admin" },
              { label: "Treasury", value: "treasury" },
            ],
          },
        ]}
      />

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        sampleUrl="/sample-users.xlsx"
        apiUrl="/users/bulk-store"
        onSuccess={refreshTable}
        title="Bulk Users Upload"
        label="Upload Bulk Users (.xlsx)"
      />
    </div>
  )
}
