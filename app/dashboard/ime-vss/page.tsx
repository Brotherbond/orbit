"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/types/user"
import BulkUploadModal from "@/components/dashboard/BulkUploadModal"

interface ImeVss extends User { }

const roles = "ime,vss"

function getColumns(
  router: any,
  toast: any,
  refreshTable: () => void
): ColumnDef<ImeVss>[] {
  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this IME-VSS user?")) return

    try {
      await apiClient.delete(`/users/${uuid}`)
      toast({
        title: "Success",
        description: "IME-VSS user deleted successfully",
      })
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete IME-VSS user",
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
      accessorKey: "market",
      header: "Market",
      cell: ({ row }) => row.original.market?.name || "No Market",
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/ime-vss/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/ime-vss/${row.original.uuid}/edit`)}>
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

export default function ImeVssPage() {
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
          <h1 className="text-3xl font-bold text-[#444444]">IME-VSS</h1>
          <p className="text-[#ababab]">Manage IME-VSS users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button className="btn-primary" onClick={() => setBulkModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bulk IME/VSS
          </Button>
          <Button className="btn-primary" onClick={() => router.push("/dashboard/ime-vss/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add IME-VSS User
          </Button>
        </div>
      </div>

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="first_name"
        searchPlaceholder="Search IME-VSS users..."
        store="imeVss"
        fixedQuery={{ roles }}
        filters={[
          {
            type: "select",
            label: "Role",
            param: "roles",
            options: [
              { label: "All Roles", value: roles },
              { label: "IME", value: "ime" },
              { label: "VSS", value: "vss" },
            ],
          },
          {
            type: "selectWithFetch",
            label: "Market",
            param: "market_id",
            fetchUrl: "/markets",
            valueKey: "uuid",
            labelKey: "full_name",
            searchParam: "search",
            placeholder: "Select market...",
            labelFormatter: (item: any) => `${item.full_name}`,
          },
        ]}
        exportFileName="IME-VSS.xlsx"
      />

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        sampleUrl="/sample-ime-vss.xlsx"
        apiUrl="/users/bulk-store"
        onSuccess={refreshTable}
        title="Bulk IME/VSS Upload"
        label="Upload Bulk IME/VSS (.xlsx)"
      />
    </div>
  )
}
