"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@/components/ui/data-table-types";
import { OrderEvent } from "@/types/order-event";


const columns: ColumnDef<unknown, unknown>[] = [
  {
    accessorKey: "order_ref",
    header: "Order Ref",
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "distributor",
    header: "Distributor Name",
    width: 200,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "ime_vss",
    header: "IME/VSS",
    width: 200,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "total_amount",
    header: "Order Value",
    width: 200,
    cell: ({ row }) => <span>₦{parseFloat((row.original as any).total_amount).toLocaleString()}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    width: 200,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    accessorKey: "confirmed_at",
    header: "Confirmed At",
    width: 200,
    cell: ({ row }) => (row.original as OrderEvent).confirmed_at || "-",
  },
  {
    accessorKey: "delivered_at",
    header: "Delivered At",
    width: 200,
    cell: ({ row }) => (row.original as OrderEvent).delivered_at || "-",
  },
  {
    accessorKey: "fulfilled_at",
    header: "Fulfilled At",
    width: 200,
    cell: ({ row }) => (row.original as OrderEvent).fulfilled_at || "-",
  },
  {
    accessorKey: "created_confirmed_lead_time",
    header: "CC Lead Time",
    width: 150,
    cell: ({ row }) => {
      const leadTime = (row.original as OrderEvent).created_confirmed_lead_time;
      if (!leadTime) return "-";
      // Parse "X hrs, Y min"
      const match = leadTime.match(/(\d+)\s*hrs?,\s*(\d+)\s*min/);
      let hours = 0;
      if (match) {
        hours = parseInt(match[1] || "0", 10);
        const mins = parseInt(match[2] || "0", 10);
        hours += mins / 60;
      }
      const isOver48 = hours >= 48;
      return (
        <span className={isOver48 ? "bg-red-600 text-white px-2 py-1 rounded" : ""}>
          {leadTime}
        </span>
      );
    },
  },
  {
    accessorKey: "confirmed_delivered_lead_time",
    header: "CD Lead Time",
    width: 150,
    cell: ({ row }) => {
      const leadTime = (row.original as OrderEvent).confirmed_delivered_lead_time;
      if (!leadTime) return "-";
      // Parse "X hrs, Y min"
      const match = leadTime.match(/(\d+)\s*hrs?,\s*(\d+)\s*min/);
      let hours = 0;
      if (match) {
        hours = parseInt(match[1] || "0", 10);
        const mins = parseInt(match[2] || "0", 10);
        hours += mins / 60;
      }
      const isOver48 = hours >= 48;
      return (
        <span className={isOver48 ? "bg-red-600 text-white px-2 py-1 rounded" : ""}>
          {leadTime}
        </span>
      );
    },
  },
  {
    accessorKey: "delivered_fulfilled_lead_time",
    header: "DF Lead Time",
    width: 150,
    cell: ({ row }) => {
      const leadTime = (row.original as OrderEvent).delivered_fulfilled_lead_time;
      if (!leadTime) return "-";
      // Parse "X hrs, Y min"
      const match = leadTime.match(/(\d+)\s*hrs?,\s*(\d+)\s*min/);
      let hours = 0;
      if (match) {
        hours = parseInt(match[1] || "0", 10);
        const mins = parseInt(match[2] || "0", 10);
        hours += mins / 60;
      }
      const isOver48 = hours >= 48;
      return (
        <span className={isOver48 ? "bg-red-600 text-white px-2 py-1 rounded" : ""}>
          {leadTime}
        </span>
      );
    },
  },
];

export default function ReportsPage() {

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        store="orderEvents"
        searchKey="distributor"
        searchPlaceholder="Search by reference"
        exportFileName={`LeadTime.xlsx`}
      />
    </div>
  );
}
