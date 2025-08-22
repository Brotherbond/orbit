"use client"

import ListPageHeader from "@/components/dashboard/ListPageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Order } from "@/types/order"
import { Edit, Eye, MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useRef } from "react"

export default function OrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const dataTableRef = useRef<{ refresh: () => void }>(null);
  const columns = React.useMemo(() => getColumns(session, router),[session, router]);

  // Filter config for orders
  const filters: import("@/components/ui/data-table").FilterConfig[] = [
    {
      type: "select",
      label: "Status",
      param: "status",
      options: [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Update Requested", value: "update_requested" },
        { label: "Rejected", value: "rejected" },
        { label: "Delivered", value: "delivered" },
        { label: "Fulfilled", value: "fulfilled" },
      ],
    },
    {
      type: "selectWithFetch",
      label: "Distributor",
      param: "distributor",
      fetchUrl: "/distributors",
      valueKey: "user.uuid",
      labelKey: "business_name",
      searchParam: "search",
      placeholder: "Select distributor...",
      labelFormatter: (item: any) => `${item.business_name}`,
    },
    {
      type: "selectWithFetch",
      label: "Market",
      param: "market",
      fetchUrl: "/markets",
      valueKey: "uuid",
      labelKey: "full_name",
      searchParam: "search",
      placeholder: "Select market...",
      labelFormatter: (item: any) => `${item.full_name}`,
    },
  ]

  return (
    <div>
      <ListPageHeader
        title="Orders"
        description="Manage and track all orders in the system"
      />
      <DataTable
        ref={dataTableRef}
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        store="orders"
        exportFileName="Orders.xlsx"
        filters={filters}
      />
    </div>
  )
}

export function getColumns(session: any, router: any): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "ref",
      header: "Order Ref",
      cell: ({ row }) => <div className="text-sm">{row.original.ref}</div>,
    },
    {
      accessorKey: "distributor_user.distributor_details.business_name",
      header: "Distributor",
      width:175,
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
      width:175,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.ime_vss.full_name}
        </div>
      ),
    },
    {
      accessorKey: "market",
      header: "Market",
      width:150,
      cell: ({ row }) => <div className="text-sm">{row.original.market}</div>,
    },
    {
      accessorKey: "self_pickup",
      width:120,
      header: "Self Pickup",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.self_pickup ? "Yes" : "No"}
        </div>
      ),
    },
    {
      accessorKey: "promos",
      header: "Promos",
      width:100,
      cell: ({ row }) => (
        <div className="text-sm">
          {(row.original.promos?.type || "None")}
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Value",
      width:150,
      cell: ({ row }) => <div className="font-medium">₦{parseFloat(row.original.total_amount).toLocaleString()}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      width:200,
      cell: ({ row }) => row.original.created_at,
    },
    {
      accessorKey: "status",
      header: "Status",
      width:175,
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userRole = session?.user?.role?.toLowerCase() || "";
        // Replace with mutation hook or handleSubmit utility
        const handleConfirmPayment = () => {
          // useConfirmPaymentMutation({ uuid: row.original.uuid, status: "confirmed", onSuccess: refreshTable })
        };
        const handleConfirmOrder = () => {
          // useConfirmOrderMutation({ uuid: row.original.uuid, status: "approved", onSuccess: refreshTable })
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
