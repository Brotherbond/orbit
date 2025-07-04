"use client";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@/components/ui/data-table-types";

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
    width: 200,
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
    cell: ({ row }) => <span>₦{parseFloat((row.original as any).total_amount).toLocaleString()}</span>,
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
    width: 150,
    cell: ({ row }) => {
      const leadTime = (row.original as OrderEvent).lead_time;
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
