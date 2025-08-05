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
      accessorKey: "location",
      header: "Location",
      width: 200,
      cell: ({ row }) => <div className="text-sm">{row.original.location}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      width: 200,
      cell: ({ row }) => <div className="text-sm">{row.original.date}</div>,
    },
    {
      accessorKey: "customer_name",
      header: "Customer Name",
      width: 200,
      cell: ({ row }) => <div className="text-sm">{row.original.customer_name}</div>,
    },
    {
      accessorKey: "customer_type",
      header: "Customer Type",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.customer_type.charAt(0).toUpperCase() + row.original.customer_type.slice(1).toLowerCase()}</div>,
    },
    {
      accessorKey: "sales_type",
      header: "Sales Type",
      width: 150,
      cell: ({ row }) => <div className="text-sm">Sales</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.category}</div>,
    },
    {
      accessorKey: "brand_name",
      header: "Product Description",
      width: 200,
      cell: ({ row }) => <div className="text-sm">{row.original.brand_name}</div>,
    },
    {
      accessorKey: "pcs_per_carton",
      header: "Pieces /Ctn",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.pcs_per_carton ?? '0'}</div>,
    },
    {
      accessorKey: "cartons_sold",
      header: "Ctn Sold",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{row.original.cartons_sold}</div>,
    },
    {
      header: "Pieces Sold",
      width: 150,
      cell: ({ row }) => <div className="text-sm">{(Number(row.original.cartons_sold ?? '0') * Number(row.original.pcs_per_carton ?? '0'))}</div>,
    },
    {
      accessorKey: "price_per_carton",
      header: "Price per Carton",
      width: 200,
      cell: ({ row }) => <div className="font-medium">₦{parseFloat(row.original.price_per_carton).toLocaleString()}</div>,
    },
    {
      accessorKey: "sales_value",
      header: "Sales Value",
      width: 150,
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
