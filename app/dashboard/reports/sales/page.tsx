"use client";
import { useMemo } from "react"
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@/components/ui/data-table-types";
import { Order } from "@/types/order";

export function getColumns(): ColumnDef<Order>[] {
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
      accessorKey: "total_amount",
      header: "Sales Value",
      cell: ({ row }) => <div className="font-medium">₦{parseFloat(row.original.total_amount).toLocaleString()}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Cartons Sold",
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.brands.reduce((acc, brand) => acc + Number(brand.quantity), 0)}</div>;
      },
    },
  ]
}

export default function ReportsPage() {
  const columns = useMemo(() => getColumns(), []);
  return (
    <div className="space-y-6">
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        store="orders"
        filters={[{
          type: "selectWithFetch",
          label: "Distributor",
          param: "distributor",
          fetchUrl: "/distributors",
          valueKey: "user.uuid",
          labelKey: "business_name",
          searchParam: "search",
          placeholder: "Select distributor...",
          labelFormatter: (item: any) => `${item.business_name}`,
        }, { type: 'disableDefaultDateRange' }
        ]}
        searchKey="order_ref"
        searchPlaceholder="Search..."
        exportFileName={`Sales.xlsx`}
      />
    </div>
  );
}
