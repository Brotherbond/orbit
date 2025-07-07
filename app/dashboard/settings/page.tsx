"use client"

import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface Setting {
  uuid: string
  key: string
  value: string
  description: string
  status: string
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast();
  redirect("/dashboard");

  const columns: ColumnDef<Setting>[] = [
    {
      accessorKey: "key",
      header: "Key",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.key}</div>
          <div className="text-sm text-muted-foreground">{row.original.description}</div>
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: "Value",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        let variant: "default" | "secondary" | "destructive" = "secondary"
        let className = "status "

        switch (status) {
          case "active":
          case "confirmed":
            variant = "default"
            className += "active"
            break
          case "pending":
            className += "pending"
            break
          case "fulfilled":
            variant = "default"
            className = "bg-green-500 hover:bg-green-600"
            break
          case "delivered":
            variant = "default"
            className = "bg-blue-500 hover:bg-blue-600"
            break
          case "inactive":
          case "cancelled":
            variant = "destructive"
            className += "inactive"
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
            <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/${row.original.uuid}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/${row.original.uuid}/edit`)}>
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
    if (!confirm("Are you sure you want to delete this setting?")) return

    try {
      await apiClient.delete(`/settings/${id}`)
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Settings</h1>
          <p className="text-[#ababab]">Manage system settings</p>
        </div>
        <Button className="btn-primary" onClick={() => router.push("/dashboard/settings/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Setting
        </Button>
      </div>

      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="key"
        searchPlaceholder="Search settings..."
        url="/settings"
        exportFileName="settings.xlsx"
      />
    </div>
  )
}
