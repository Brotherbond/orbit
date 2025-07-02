"use client"

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/order";

export default function DistributorOrdersPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams();
  const distributorId = params?.id as string;

  let statusFilter = "";
  const user = session?.user;
  const role = user?.role;
  if (role === "treasury") {
    statusFilter = "&status=pending";
  } else if (role === "sales-admin") {
    statusFilter = "&status=confirmed";
  }

  const columns = React.useMemo(
    () => getColumns(session, router, toast),
    [session, router, toast]
  );

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        url={`/distributors/${distributorId}/orders?${statusFilter}`}
        exportFileName="distributor-orders.xlsx"
      />
    </div>
  );
}

function getColumns(session: any, router: any, toast: any): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "ref",
      header: "Order Ref",
      cell: ({ row }) => <div className="text-sm">{row.original.ref}</div>,
    },
    {
      accessorKey: "ime_vss",
      header: "IME/VSS",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.ime_vss.first_name} {row.original.ime_vss.last_name}
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
            await apiClient.put(`/orders/${row.original.uuid}`, { status: "confirmed" });
            toast({
              title: "Success",
              description: "Order payment confirmed",
            });
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
            await apiClient.put(`/orders/${row.original.uuid}`, { status: "approved" });
            toast({
              title: "Success",
              description: "Order Approved",
            });
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${row.original.uuid}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {userRole === "treasury" ? (
                <DropdownMenuItem onClick={handleConfirmPayment}>
                  <Edit className="mr-2 h-4 w-4" />
                  Confirm Payment
                </DropdownMenuItem>
              ) : userRole === "sales-admin" ? (
                <DropdownMenuItem onClick={handleConfirmOrder}>
                  <Edit className="mr-2 h-4 w-4" />
                  Approve Order
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${row.original.uuid}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
