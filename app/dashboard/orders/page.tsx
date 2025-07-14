"use client"


import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { MoreHorizontal, Eye, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/types/order"


export function getStatusFilter(role?: string): string {
  if (role && ["treasury", "sales-admin"].includes(role)) {
    return "";
  } else if (role === "sales-admin") {
    return "&status=confirmed";
  }
  return "";
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null)

  const user = session?.user
  const role = user?.role
  const statusFilter = getStatusFilter(role)

  const refreshTable = () => {
    dataTableRef.current?.refresh()
  }

  const columns = React.useMemo(
    () => getColumns(session, router, toast, refreshTable),
    [session, router, toast]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Orders</h1>
          <p className="text-[#ababab]">Manage and track all orders in the system</p>
        </div>
      </div>
      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        url={`/orders?${statusFilter}`}
        exportFileName="Orders.xlsx"
      />
    </div>
  )
}

export function getColumns(session: any, router: any, toast: any, refreshTable: () => void): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "ref",
      header: "Order Ref",
      cell: ({ row }) => <div className="text-sm">{row.original.ref}</div>,
    },
    {
      accessorKey: "distributor_user.distributor_details.business_name",
      header: "Distributor",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.distributor_user.distributor_details.business_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.distributor_user.full_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ime_vss.full_name",
      header: "IME/VSS",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.ime_vss.full_name}
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Value",
      cell: ({ row }) => <div className="font-medium">₦{parseFloat(row.original.total_amount).toLocaleString()}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => row.original.created_at,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userRole = session?.user?.role?.toLowerCase() || "";
        const handleConfirmPayment = async () => {
          try {
            const response = await apiClient.put<{ item: Order }>(`/orders/${row.original.uuid}`, { status: "confirmed" });
            toast({
              title: "Success",
              description: "Order payment confirmed",
            });
            refreshTable();
          } catch (error: any) {
            toast({
              title: "Error",
              description: error?.message || "Failed to confirm payment",
              variant: "destructive",
            });
          }
        };
        const handleConfirmOrder = async () => {
          try {
            const response = await apiClient.put<{ item: Order }>(`/orders/${row.original.uuid}`, { status: "approved" });
            toast({
              title: "Success",
              description: "Order Approved",
            });
            refreshTable();
          } catch (error: any) {
            toast({
              title: "Error",
              description: error?.message || "Failed to approve order",
              variant: "destructive",
            });
          }
        };
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/orders/${row.original.uuid}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/orders/${row.original.uuid}/tracks`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Track
              </DropdownMenuItem>
              {["sales-admin", "treasury"].includes(userRole) && row.original.status === "pending" && (
                <DropdownMenuItem className="cursor-pointer" onClick={handleConfirmPayment}>
                  <Edit className="mr-2 h-4 w-4" />
                  Confirm Payment
                </DropdownMenuItem>
              )
                // : userRole === "admin" ? (
                //   <DropdownMenuItem className="cursor-pointer"onClick={handleConfirmOrder}>
                //     <Edit className="mr-2 h-4 w-4" />
                //     Approve Order
                //   </DropdownMenuItem>
                // ) : (
                //   <DropdownMenuItem className="cursor-pointer"onClick={() => router.push(`/dashboard/orders/${row.original.uuid}/edit`)}>
                //     <Edit className="mr-2 h-4 w-4" />
                //     Update Order
                //   </DropdownMenuItem>
                // )
              }

            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]
}
