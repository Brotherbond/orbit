"use client";
import { useMemo } from "react"
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@/components/ui/data-table-types";
import { OrderBrand } from "@/types/order";

export function getColumns(): ColumnDef<OrderBrand>[] {
  return [
    {
      accessorKey: "order_ref",
      header: "Order Ref",
      cell: ({ row }) => <div className="text-sm">{row.original.order_ref}</div>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      cell: ({ row }) => <div className="text-sm">{row.original.customer_name}</div>,
    },
    {
      accessorKey: "customer_type",
      header: "Customer Type",
      cell: ({ row }) => <div className="text-sm">{row.original.customer_type.charAt(0).toUpperCase() + row.original.customer_type.slice(1).toLowerCase()}</div>,
    },
    {
      accessorKey: "sales_type",
      header: "Sales Type",
      cell: ({ row }) => <div className="text-sm">Sales</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="text-sm">{row.original.category}</div>,
    },
    {
      accessorKey: "brand_name",
      header: "Product Description",
      cell: ({ row }) => <div className="text-sm">{row.original.brand_name}</div>,
    },
    {
      accessorKey: "pcs_per_carton",
      header: "Pieces /Ctn",
      cell: ({ row }) => <div className="text-sm">{row.original.pcs_per_carton ?? '0'}</div>,
    },
    {
      accessorKey: "cartons_sold",
      header: "Ctn Sold",
      cell: ({ row }) => <div className="text-sm">{row.original.cartons_sold}</div>,
    },
    {
      header: "Pieces Sold",
      cell: ({ row }) => <div className="text-sm">{(Number(row.original.cartons_sold ?? '0') * Number(row.original.pcs_per_carton ?? '0'))}</div>,
    },
    {
      accessorKey: "price_per_carton",
      header: "Price per Carton",
      cell: ({ row }) => <div className="font-medium">₦{parseFloat(row.original.price_per_carton).toLocaleString()}</div>,
    },
    {
      accessorKey: "sales_value",
      header: "Sales Value",
      cell: ({ row }) => <div className="font-medium">₦{row.original.sales_value.toLocaleString()}</div>,
    }
  ]
}

export default function ReportsPage() {
  const columns = useMemo(() => getColumns(), []);
  return (
    <div className="space-y-6">
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        store="orderBrands"
        filters={[
          {
            type: "select",
            label: "Category",
            param: "category",
            options: [
              { label: "FnB", value: "FnB" },
              { label: "PC", value: "PC" },
              { label: "Pharma", value: "Pharma" },
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
        ]}
        searchKey="order_ref"
        searchPlaceholder="Search..."
        exportFileName={`Sales.xlsx`}
      />
    </div>
  );
}
