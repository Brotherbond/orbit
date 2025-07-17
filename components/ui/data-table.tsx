"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type ColumnDef } from "./data-table-types";
import { ChevronDown, Search, Filter, Download, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type FilterOption = { label: string; value: string };
export type FilterConfig =
  | { type: "date"; label: string; param: string }
  | { type: "select"; label: string; param: string; options: FilterOption[] }
  | { type: "text"; label: string; param: string }
  | { type: "custom"; render: React.ReactNode }
  | { type: "disableDefaultDateRange" };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  url?: string;
  exportFileName?: string;
  className?: string;
  per_page?: number;
  filters?: FilterConfig[];
}

const PAGE_SIZE_OPTIONS = [10, 25, 100, 1000];

function extractUrlAndQuery(url: string) {
  try {
    const u = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    const base = u.pathname;
    const query: Record<string, string> = {};
    u.searchParams.forEach((v, k) => {
      query[k] = v;
    });
    return { base, query };
  } catch {
    return { base: url, query: {} };
  }
}

export const DataTable = React.forwardRef(function DataTable<TData, TValue>(
  {
    columns,
    data: dataProp,
    searchKey,
    searchPlaceholder = "Search...",
    onRowClick,
    url,
    exportFileName = "export.xlsx",
    className,
    per_page,
    filters = [],
  }: DataTableProps<TData, TValue>,
  ref: React.Ref<{ refresh: () => void }>
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(
    per_page ?? PAGE_SIZE_OPTIONS[0]
  );
  const [tableData, setTableData] = React.useState<TData[]>(dataProp ?? []);
  const [total, setTotal] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [filterState, setFilterState] = React.useState<{
    [key: string]: string;
  }>({});

  React.useImperativeHandle(
    ref,
    () => ({
      refresh: () => setRefreshCount((c) => c + 1),
    }),
    []
  );

  // Build filter query string
  const filterParams = Object.entries(filterState)
    .filter(([_, v]) => v && v !== "all")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  // Compose final URL with filters
  const finalUrl = url
    ? url.includes("?")
      ? `${url}&${filterParams}`
      : `${url}?${filterParams}`
    : undefined;

  // Fetch data if url is provided
  React.useEffect(() => {
    let ignore = false;
    async function fetchData() {
      if (!finalUrl) {
        setTableData(dataProp ?? []);
        setTotal(dataProp?.length ?? 0);
        setPageCount(1);
        return;
      }
      setLoading(true);
      try {
        // Extract base and query from url
        const { base, query } = extractUrlAndQuery(finalUrl);
        const params: { [key: string]: string } = {
          ...query,
          page: (pageIndex + 1).toString(),
          per_page: pageSize.toString(),
        };
        // Add filters if any
        if (searchKey && columnFilters.length > 0) {
          const filter = columnFilters.find((f) => f.id === searchKey);
          if (filter && typeof filter.value === "string" && filter.value) {
            params[searchKey] = filter.value;
          }
        }
        const searchParams = new URLSearchParams(params).toString();
        const endpoint = `${base}?${searchParams}`;
        const res = await apiClient.get<any>(endpoint);
        let items = res.data.items ?? [];
        items = items.map((item: any) => ({
          ...item,
          id: item.id ?? item.uuid ?? undefined,
        }));
        const meta = res.meta?.pagination;
        if (!ignore) {
          setTableData(items);
          setTotal(meta?.total ?? items.length);
          setPageCount(meta?.last_page ?? 1);
          const currentPage = meta?.current_page;
          if (typeof currentPage === "number" && currentPage > 0) {
            setPageIndex(currentPage - 1);
          }
        }
      } catch (e) {
        if (!ignore) {
          setTableData([]);
          setTotal(0);
          setPageCount(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalUrl, pageIndex, pageSize, columnFilters, dataProp, refreshCount]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: !!url,
    pageCount: pageCount,
  });

  // Handlers for pagination
  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pageCount) return;
    setPageIndex(page);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  // Debounced search state for API mode
  const [searchValue, setSearchValue] = React.useState("");

  // Reset search/filter state only when url changes (prevents infinite loop)
  React.useEffect(() => {
    setFilterState({});
    setSearchValue("");
  }, [url]);

  // Debounced search for API mode
  React.useEffect(() => {
    if (!url) return;
    const timeout = setTimeout(() => {
      setFilterState((s) => ({ ...s, search: searchValue }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, url]);

  // Memoized effective filters with default date range unless disabled
  const effectiveFilters = React.useMemo(() => {
    if (!filters || !Array.isArray(filters)) return [];
    if (filters.some((f) => f.type === "disableDefaultDateRange")) {
      return filters.filter((f) => f.type !== "disableDefaultDateRange");
    }
    return [
      { type: "date", label: "Start Date", param: "start_date" },
      { type: "date", label: "End Date", param: "end_date" },
      ...filters.filter((f) => f.type !== "disableDefaultDateRange"),
    ];
  }, [filters]);

  return (
    <div
      className={`w-full card bg-white shadow-md rounded-lg p-4${className ? " " + className : ""}`}
    >
      {/* Filter row */}
      {effectiveFilters.length > 0 && (
        <div className="flex flex-wrap items-end gap-4 mb-4">
          {effectiveFilters.map((filter, idx) => {
            if (filter.type === "custom" && "render" in filter) {
              return (
                <div key={idx} className="flex flex-col min-w-[8rem]">
                  {filter.render}
                </div>
              );
            }
            if (
              "param" in filter &&
              "label" in filter &&
              (filter.type === "date" ||
                filter.type === "text" ||
                filter.type === "select")
            ) {
              let input = null;
              const commonProps = {
                className: "w-40 h-10 px-2 py-2 rounded border",
                value: filterState[filter.param] || "",
                onChange: (
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
                ) =>
                  setFilterState((s) => ({
                    ...s,
                    [filter.param]: e.target.value,
                  })),
              };
              if (filter.type === "date") {
                input = <Input type="date" {...commonProps} />;
              } else if (filter.type === "select" && "options" in filter) {
                input = (
                  <select
                    {...commonProps}
                    value={filterState[filter.param] || "all"}
                  >
                    {(filter.options as FilterOption[]).map(
                      (opt: FilterOption) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      )
                    )}
                  </select>
                );
              } else if (filter.type === "text") {
                input = <Input type="text" {...commonProps} />;
              }
              return (
                <div key={filter.param} className="flex flex-col min-w-[8rem]">
                  <label className="mb-1 text-xs font-medium text-gray-600">
                    {filter.label}
                  </label>
                  {input}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
      {/* Search, refresh, export, columns row */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          {searchKey && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={
                  url
                    ? searchValue
                    : ((searchKey &&
                      (table
                        .getColumn(searchKey)
                        ?.getFilterValue() as string)) ??
                      "")
                }
                onChange={(event) => {
                  if (url) {
                    setSearchValue(event.target.value);
                  } else if (searchKey) {
                    table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value);
                  }
                }}
                className="pl-8 max-w-sm"
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshCount((c) => c + 1)}
            title="Refresh"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                onClick={() => {
                  // Only export visible columns
                  const visibleCols = table
                    .getAllLeafColumns()
                    .filter(
                      (col) =>
                        col.getIsVisible() &&
                        col.id !== "actions" &&
                        typeof col.columnDef.header === "string" &&
                        typeof (col.columnDef as any).accessorKey === "string"
                    )
                    .map((col) => ({
                      accessorKey: (col.columnDef as any).accessorKey as string,
                      header: col.columnDef.header as string,
                    }));
                  const rows = tableData.map((row) => {
                    const obj: { [key: string]: unknown } = {};
                    visibleCols.forEach((col) => {
                      obj[col.header] = col.accessorKey
                        .split(".")
                        .reduce(
                          (acc, k) =>
                            acc && typeof acc === "object"
                              ? (acc as any)[k]
                              : undefined,
                          row
                        );
                    });
                    return obj;
                  });
                  const ws = XLSX.utils.json_to_sheet(rows);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                  const now = new Date();
                  const pad = (n: number) => n.toString().padStart(2, "0");
                  const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
                  const baseName = exportFileName.replace(/\.xlsx$/, "");
                  XLSX.writeFile(
                    wb,
                    `ORBIT_${baseName}_Report_${datetime}_current_page.xlsx`
                  );
                }}
              >
                Export Current Page
              </DropdownMenuCheckboxItem>
              {url && (
                <DropdownMenuCheckboxItem
                  onClick={async () => {
                    // Fetch all data from url with large per_page using apiClient
                    let allRows: any[] = [];
                    try {
                      const { base, query } = extractUrlAndQuery(url);
                      const params: { [key: string]: string } = {
                        ...query,
                        page: "1",
                        per_page: "10000",
                      };
                      const searchParams = new URLSearchParams(
                        params
                      ).toString();
                      const endpoint = `${base}?${searchParams}`;
                      const res = await apiClient.get<any>(endpoint);
                      allRows = res.data.items ?? [];
                      // Ensure each item has an 'id' property for export consistency
                      allRows = allRows.map((item: any) => ({
                        ...item,
                        id: item.id ?? item.uuid ?? undefined,
                      }));
                    } catch (e) {
                      alert("Failed to fetch all data for export");
                      return;
                    }
                    const visibleCols = table
                      .getAllLeafColumns()
                      .filter(
                        (col) =>
                          col.getIsVisible() &&
                          col.id !== "actions" &&
                          typeof col.columnDef.header === "string" &&
                          typeof (col.columnDef as any).accessorKey === "string"
                      )
                      .map((col) => ({
                        accessorKey: (col.columnDef as any)
                          .accessorKey as string,
                        header: col.columnDef.header as string,
                      }));
                    const rows = allRows.map((row) => {
                      const obj: { [key: string]: unknown } = {};
                      visibleCols.forEach((col) => {
                        obj[col.header] = col.accessorKey
                          .split(".")
                          .reduce((acc, k) => acc?.[k], row);
                      });
                      return obj;
                    });
                    const ws = XLSX.utils.json_to_sheet(rows);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    const now = new Date();
                    const pad = (n: number) => n.toString().padStart(2, "0");
                    const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
                    const baseName = exportFileName.replace(/\.xlsx$/, "");
                    XLSX.writeFile(
                      wb,
                      `ORBIT_${baseName}_Report_${datetime}_all.xlsx`
                    );
                  }}
                >
                  Export All
                </DropdownMenuCheckboxItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const width = (header.column.columnDef as any).width;
                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      style={width ? { width } : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="flex items-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {{
                                asc: "▲",
                                desc: "▼",
                              }[header.column.getIsSorted() as string] ?? ""}
                            </span>
                          )}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const width = (cell.column.columnDef as any).width;
                    return (
                      <TableCell
                        key={cell.id}
                        style={width ? { width } : undefined}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {total === 0 ? 0 : pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, total)} of {total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              const page = i + Math.max(0, pageIndex - 2);
              if (page >= pageCount) return null;
              return (
                <Button
                  key={page}
                  variant={page === pageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={page === pageIndex ? "btn-primary" : ""}
                >
                  {page + 1}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
});
