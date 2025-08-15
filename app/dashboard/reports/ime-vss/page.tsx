"use client";
import { Badge } from "@/components/ui/badge";
import { DataTable, FilterConfig } from "@/components/ui/data-table";
import { IMEVSSPerformance } from "@/types/ime-vss-performance";
import { Row } from "@tanstack/react-table";
import { useRef, useEffect } from "react";
import { useGetIMEVSSsPerformanceQuery } from "@/store/ime-vss-performance";
import { ColumnDef } from "@/components/ui/data-table-types";

type IMEVSSRow = Row<IMEVSSPerformance>;

const generateDayColumns = (maxDays: number = 21) => {
  const dayColumns = [];

  for (let i = 1; i <= maxDays; i++) {
    const dayKey = `day_${i}`;
    dayColumns.push({
      accessorKey: `performance_by_day.${dayKey}`,
      header: `Day ${i}`,
      width: 100,
      cell: ({ row }: { row: IMEVSSRow }) => {
        const dayData = row.original.performance_by_day[dayKey];
        return (
          <div className="flex-col items-center" title={dayData?.date || ''}>
            <div className="font-semibold text-[#444444]">
              Daily: {dayData?.daily_performance || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Cumu.: {dayData?.cummulative_performance || 0}
            </div>
          </div>
        );
      },
      exportValue: (row: IMEVSSPerformance) => {
        const dayData = row.performance_by_day?.[dayKey];
        return `Daily: ${dayData?.daily_performance ?? 0}, \nCumu.: ${dayData?.cummulative_performance ?? 0}`;
      },
    });
  }

  return dayColumns;
};

// Define columns with proper typing
const columns = [
  {
    accessorKey: "user.full_name",
    header: "IME/VSS",
    width: 200,
    cell: ({ row }: { row: IMEVSSRow }) => (
      <div>
        <div className="font-medium">
          {row.original.user.first_name} {row.original.user.last_name}
        </div>
        <div className="text-sm text-muted-foreground">{row.original.user.email}</div>
      </div>
    ),
  },
  {
    accessorKey: "user.status",
    header: "Status",
    cell: ({ row }: { row: IMEVSSRow }) => (
      <Badge
        variant={row.original.user.status === "active" ? "default" : "destructive"}
        className={`status ${row.original.user.status === "active" ? "active" : "inactive"}`}
      >
        {row.original.user.status}
      </Badge>
    ),
  },
  ...generateDayColumns(),
];

export default function ReportsPage() {
  const { data: storeData, isLoading } = useGetIMEVSSsPerformanceQuery({});

  const columnsRef = useRef<any>(columns);

  const getDynamicColumns = (data: IMEVSSPerformance[] | undefined) => {
    if (data && data.length > 0 && data[0].workday_count) {
      const maxDays = data[0].workday_count;
      return [
        columns[0],
        columns[1],
        ...generateDayColumns(maxDays)
      ] as any;
    }
    return columns as ColumnDef<IMEVSSPerformance>[];
  };

  useEffect(() => {
    let performanceData: IMEVSSPerformance[] | undefined = (storeData as any)?.data?.items;
    if (performanceData && performanceData.length > 0) {
      columnsRef.current = getDynamicColumns(performanceData);
    }
  }, [storeData]);

  // Define filters
  const filters: FilterConfig[] = [
    { type: "disableDefaultDateRange" },
    { type: "month-year", label: "Month/Year", param: "month" }
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columnsRef.current}
        store="imeVssPerformance"
        searchKey="user"
        searchPlaceholder="Search by ime/vss"
        exportFileName={`IME-VSS-Performance.xlsx`}
        filters={filters}
        per_page={20}
      />
    </div>
  );
}
