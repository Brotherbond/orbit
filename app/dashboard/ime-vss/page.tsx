"use client"

import BulkUploadModal from "@/components/dashboard/BulkUploadModal"
import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleDelete } from "@/lib/handleDelete"
import { User } from "@/types/user"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"

interface ImeVss extends User { }

const roles = "ime,vss"

function getColumns(
  router: any,
  refreshTable: () => void
): ColumnDef<ImeVss>[] {
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
      header: "Created At",
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
            <DropdownMenuItem
              onClick={() =>
                handleDelete({
                  storeName: "imeVss",
                  uuid: row.original.uuid,
                  onSuccess: refreshTable,
                })
              }
              className="text-red-600"
            >
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
  const dataTableRef = useRef<{ refresh: () => void }>(null)

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(router, refreshTable),
    [router]
  )

  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  return (
    <div>
      <ListPageHeader
        title="IME-VSS"
        description="Manage IME-VSSs and their permissions"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/ime-vss/create")}
        addLabel="Add IME-VSS"
        showBulkAddButton={true}
        onBulkAdd={() => setBulkModalOpen(true)}
        bulkAddLabel="Add Bulk IME/VSS"
      />

      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="first_name"
        searchPlaceholder="Search IME-VSSs..."
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
