"use client";
import ListPageHeader from "@/components/dashboard/ListPageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { handleDelete } from "@/lib/handleDelete";
import { Market } from "@/types/market";
import { Edit, Eye, MapPin, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";


export default function MarketsPage() {
  const router = useRouter()
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/markets/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/markets/${row.original.uuid}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteMarket(row.original.uuid)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]


  const onDeleteMarket = (uuid: string) => {
    handleDelete({
      storeName: "markets",
      uuid,
      onSuccess: router.refresh,
    })
  }

  return (
    <div>
      <ListPageHeader
        title="Markets"
        description="Manage market regions and territories"
        showAddButton={true}
        onAdd={() => router.push("/dashboard/markets/create")}
        addLabel="Add Market"
      />

      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="name"
        searchPlaceholder="Search markets..."
        store="markets"
        exportFileName="Markets.xlsx"
      />
    </div>
  )
}
