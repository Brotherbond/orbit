"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type OrderEvent = {
  uuid: string;
  order_ref: string;
  ime_vss: string;
  distributor: string;
  total_amount: string;
  created_at: string;
  delivered_at?: string;
  confirmed_at?: string;
  fulfilled_at?: string;
  lead_time?: string;
};

const columns: ColumnDef<unknown, unknown>[] = [
  {
    accessorKey: "order_ref",
    header: "Order Ref",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "distributor",
    header: "Distributor Name",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "ime_vss",
    header: "IME/VSS",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "total_amount",
    header: "Order Value",
    cell: ({ row }) => (row.original as any).total_amount || "-",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "confirmed_at",
    header: "Confirmed At",
    cell: ({ row }) => (row.original as OrderEvent).confirmed_at || "-",
  },
  {
    accessorKey: "fulfilled_at",
    header: "Fulfilled At",
    cell: ({ row }) => (row.original as OrderEvent).fulfilled_at || "-",
  },
  {
    accessorKey: "lead_time",
    header: "Lead Time",
    cell: ({ row }) => (row.original as OrderEvent).lead_time || "-",
  },
];

export default function ReportsPage() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <DataTable
        columns={columns}
        url={`/orders/events`}
        searchKey="distributor"
        searchPlaceholder="Search by reference"
        exportFileName="draft-reports.xlsx"
      />
    </div>
  );
}
