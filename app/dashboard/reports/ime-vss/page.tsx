"use client";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@/components/ui/data-table-types";

const columns: ColumnDef<unknown, unknown>[] = [
  {
    accessorKey: "ime_vss",
    header: "IME/VSS",
    width: 200,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          {row.original.ime_vss.first_name} {row.original.ime_vss.last_name}
        </div>
        <div className="text-sm text-muted-foreground">{row.original.ime_vss.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.ime_vss.status === "active" ? "default" : "destructive"}
        className={`status ${row.original.ime_vss.status === "active" ? "active" : "inactive"}`}
      >
        {row.original.ime_vss.status}
      </Badge>
    ),
  },
  {
    accessorKey: "day_1",
    header: "Day 1",
    width: 200,
    cell: ({ row }) => <div className="flex-col items-center">
      <div className="font-semibold text-[#444444]">
        Daily Perf: {row.original.dates[0].value}
      </div>
      <div className="text-sm text-muted-foreground">
        Cumu. Perf: {row.original.dates[0].total}
      </div>
    </div>,
  },
  {
    accessorKey: "day_2",
    header: "Day 2",
    width: 200,
    cell: ({ row }) => <div className="flex-col items-center">
      <div className="font-semibold text-[#444444]">
        Daily Perf: {row.original.dates[1].value}
      </div>
      <div className="text-sm text-muted-foreground">
        Cumu. Perf: {row.original.dates[1].total}
      </div>
    </div>,
  },
  {
    accessorKey: "day_3",
    header: "Day 3",
    width: 200,
    cell: ({ row }) => <div className="flex-col items-center">
      <div className="font-semibold text-[#444444]">
        Daily Perf: {row.original.dates[2].value}
      </div>
      <div className="text-sm text-muted-foreground">
        Cumu. Perf: {row.original.dates[2].total}
      </div>
    </div>,
  },
  {
    accessorKey: "day_4",
    header: "Day 4",
    width: 200,
    cell: ({ row }) => <div className="flex-col items-center">
      <div className="font-semibold text-[#444444]">
        Daily Perf: {row.original.dates[3].value}
      </div>
      <div className="text-sm text-muted-foreground">
        Cumu. Perf: {row.original.dates[3].total}
      </div>
    </div>,
  },
  {
    accessorKey: "day_5",
    header: "Day 5",
    width: 200,
    cell: ({ row }) => <div className="flex-col items-center">
      <div className="font-semibold text-[#444444]">
        Daily Perf: {row.original.dates[4].value}
      </div>
      <div className="text-sm text-muted-foreground">
        Cumu. Perf: {row.original.dates[4].total}
      </div>
    </div>,
  },
];

const data = [
  {
    ime_vss: {
      "uuid": "3b4d7305-b132-451d-9dbe-c3e22de02870",
      "first_name": "Austin13011",
      "last_name": "IME13011",
      "full_name": "Austin13011 IME13011",
      "email": "austin.ime13011@example.com",
      "phone": "+12345678913011",
      "market": {
        "uuid": "f91c6ec3-25ae-4ecb-8d8e-23c6f217939d",
        "name": "Mushin market",
        "type": "retail",
        "full_name": "Mushin market (retail)",
        "longitude": null,
        "latitude": null,
        "created_at": "2025-06-25 09:39 AM"
      },
      "email_verified_at": null,
      "status": "active",
      "role": {
        "uuid": "d1a9a5e0-3514-4109-8da4-5d80bb4780df",
        "name": "ime",
        "created_at": "2025-08-07 12:32 PM"
      },
      "is_active": true,
      "has_distributor": false,
      "created_at": "2025-06-25 13:04 PM"
    },
    dates: [{ day: 1, date: "01-08-2025", value: 1000, total: 1000 }, { day: 2, date: "02-08-2025", value: 1500, total: 2500 }, { day: 3, date: "03-08-2025", value: 2000, total: 4500 }, { day: 4, date: "04-08-2025", value: 2500, total: 7000 }, { day: 5, date: "05-08-2025", value: 3000, total: 10000 }],
  },
]

export default function ReportsPage() {

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data}
        // store="imeVssPerformance"
        searchKey="ime_vss"
        searchPlaceholder="Search by ime/vss"
        exportFileName={`IME-VSS-Performance.xlsx`}
      />
    </div>
  );
}
