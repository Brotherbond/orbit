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
import { ChevronDown, Search, Download, RefreshCw, Filter } from "lucide-react";
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
import { SelectWithFetch } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
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
  | {
    type: "selectWithFetch";
    label: string;
    param: string;
    fetchUrl: string;
    valueKey?: string;
    labelKey?: string;
    searchParam?: string;
    placeholder?: string;
    labelFormatter?: (item: any) => string;
  }
  | { type: "text"; label: string; param: string }
  | { type: "custom"; render: React.ReactNode }
  | { type: "disableDefaultDateRange" };

import { storeHooks, storeApis } from "@/store";
import { skipToken } from "@reduxjs/toolkit/query";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  store?: keyof typeof storeHooks;
  exportFileName?: string;
  className?: string;
  per_page?: number;
  filters?: FilterConfig[];
  params?: Record<string, any>; // URL parameters for parameterized endpoints
  fixedQuery?: Record<string, any>; // Query string parameters
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Helper function to export table data to Excel
 */
const exportToExcel = (
  tableData: any[],
  table: any,
  exportFileName: string
) => {
  // Get visible columns excluding actions
  const visibleCols = table
    .getAllLeafColumns()
    .filter(
      (col: any) =>
        col.getIsVisible() &&
        col.id !== "actions" &&
        typeof col.columnDef.header === "string" &&
        typeof col.columnDef.accessorKey === "string"
    )
    .map((col: any) => ({
      accessorKey: col.columnDef.accessorKey as string,
      header: col.columnDef.header as string,
    }));

  // Transform data for export
  const rows = tableData.map((row) => {
    const obj: { [key: string]: unknown } = {};
    visibleCols.forEach((col: { accessorKey: string; header: string }) => {
      obj[col.header] = col.accessorKey
        .split(".")
        .reduce(
          (acc: any, k: string) =>
            acc && typeof acc === "object" ? acc[k] : undefined,
          row
        );
    });
    return obj;
  });

  // Create and download Excel file
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
  const baseName = exportFileName.replace(/\.xlsx$/, "");

  XLSX.writeFile(wb, `ORBIT_${baseName}_Report_${datetime}_current_page.xlsx`);
};

export const DataTable = React.forwardRef(function DataTable<TData, TValue>(
  {
    columns,
    data: dataProp,
    searchKey,
    searchPlaceholder = "Search...",
    onRowClick,
    store,
    exportFileName = "export.xlsx",
    className,
    per_page,
    filters = [],
    params = {},
    fixedQuery = {},
  }: DataTableProps<TData, TValue>,
  ref: React.Ref<{ refresh: () => void }>
) {
  const { dismiss } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [paginationInput, setPaginationInput] = React.useState("");
  const [paginationError, setPaginationError] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(per_page ?? PAGE_SIZE_OPTIONS[0]);
  const [refreshCount, setRefreshCount] = React.useState(0);
  const [filterState, setFilterState] = React.useState<{ [key: string]: string }>({});
  const [pendingFilterState, setPendingFilterState] = React.useState<{ [key: string]: string }>({});
  const [activeFilters, setActiveFilters] = React.useState<{ [key: string]: boolean }>({});
  const [filterDropdownOpen, setFilterDropdownOpen] = React.useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      refresh: () => setRefreshCount((c) => c + 1),
    }),
    []
  );

  React.useEffect(() => {
    if (filterDropdownOpen) {
      setPendingFilterState(filterState);
    }
  }, [filterDropdownOpen]);

  // Store-based data fetching
  let tableData: TData[] = [];
  let total = 0;
  let pageCount = 1;
  let loading = false;

  // Memoized filter and store parameters
  const filterParams = React.useMemo(
    () =>
      Object.entries(filterState)
        .filter(([_, value]) => value && value !== "all")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    [filterState]
  );

  const storeParams = React.useMemo(() => {
    if (!store) return undefined;

    return {
      ...params,
      ...fixedQuery,
      ...filterParams,
      page: pageIndex + 1,
      per_page: pageSize,
    };
  }, [store, params, fixedQuery, filterParams, pageIndex, pageSize]);

  const storeHook = store ? storeHooks[store] : undefined;
  const storeQuery = storeHook ? storeHook(storeParams ?? skipToken) : undefined;

  // Only refetch when user clicks Refresh
  React.useEffect(() => {
    if (storeQuery && storeQuery.refetch && refreshCount > 0) {
      storeQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  if (store && storeQuery) {
    const resp = storeQuery.data as any;
    if (resp && Array.isArray(resp)) {
      tableData = resp as TData[];
      total = tableData.length;
      pageCount = 1;
    } else {
      const items = resp?.data?.items ?? [];
      tableData = items as TData[];
      const pagination = resp?.meta?.pagination;
      total = Number(pagination?.total) ?? tableData.length;
      pageCount = Number(pagination?.last_page) || 1;
    }
    loading = storeQuery.isLoading || storeQuery.isFetching;
  } else {
    tableData = dataProp ?? [];
    total = tableData.length;
    pageCount = 1;
    loading = false;
  }

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
    manualPagination: !!store,
    pageCount: pageCount,
  });

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page < 0 || page >= pageCount) return;
    setPageIndex(page);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
  };

  // Debounced search state for API/store mode
  const [searchValue, setSearchValue] = React.useState("");

  // Reset search/filter/page state only when store changes (prevents unnecessary refetch)
  React.useEffect(() => {
    setFilterState({});
    setSearchValue("");
    setPageIndex(0);
  }, [store]);

  // Debounced search for API/store mode
  React.useEffect(() => {
    if (!store) return;
    const timeout = setTimeout(() => {
      setFilterState((s) => ({ ...s, search: searchValue }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, store]);

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
      {/* Search, refresh, export, columns row */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          {searchKey && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={
                  store
                    ? searchValue
                    : ((searchKey &&
                      (table
                        .getColumn(searchKey)
                        ?.getFilterValue() as string)) ??
                      "")
                }
                onChange={(event) => {
                  if (store) {
                    setSearchValue(event.target.value);
                    setPageIndex(0);
                  } else if (searchKey) {
                    table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value);
                    setPageIndex(0);
                  }
                }}
                className="pl-8 max-w-sm"
              />
            </div>
          )}
          <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {Object.values(activeFilters).some(Boolean) || Object.values(filterState).some(v => v && v !== "all") ? (
                  <Filter className="mr-2 h-4 w-4 fill-current text-primary" />
                ) : (
                  <Filter className="mr-2 h-4 w-4" />
                )}
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={4}
              className="min-w-[18rem] p-2"
              onInteractOutside={(e) => {
                const target = e.target as Element;
                if (target.closest('[data-radix-select-content]') ||
                  target.closest('[data-radix-popper-content-wrapper]')) {
                  e.preventDefault();
                }
              }}
            >
              {effectiveFilters.map((filter, idx) => {
                if (filter.type === "custom" && "render" in filter) {
                  return (
                    <div key={idx} className="flex flex-col min-w-[8rem] px-2 py-1">
                      {filter.render}
                    </div>
                  );
                }
                if (
                  "param" in filter &&
                  "label" in filter &&
                  (filter.type === "date" ||
                    filter.type === "text" ||
                    filter.type === "select" ||
                    filter.type === "selectWithFetch")
                ) {
                  return (
                    <div key={filter.param} className="flex flex-col min-w-[8rem] px-2 py-2 border-b last:border-b-0">
                      <DropdownMenuCheckboxItem
                        checked={!!activeFilters[filter.param]}
                        indicatorClassName="border border-[black]"
                        onCheckedChange={(checked) => {
                          setActiveFilters((prev) => ({
                            ...prev,
                            [filter.param]: checked,
                          }));
                          if (!checked) {
                            setPendingFilterState((prev) => {
                              const next = { ...prev };
                              delete next[filter.param];
                              return next;
                            });
                          }
                        }}
                        className="font-medium"
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                      {!!activeFilters[filter.param] && (
                        <div className="mt-2 pl-6">
                          {filter.type === "date" && (
                            <Input
                              type="date"
                              className="w-full h-9 px-2 py-1 rounded border bg-gray-50 focus:bg-white focus:border-primary"
                              value={pendingFilterState[filter.param] || ""}
                              onChange={(e) =>
                                setPendingFilterState((s) => ({
                                  ...s,
                                  [filter.param]: e.target.value,
                                }))
                              }
                              placeholder={filter.label}
                            />
                          )}
                          {filter.type === "select" && "options" in filter && (
                            <select
                              className="w-full h-9 px-2 py-1 rounded text-[14px] border bg-gray-50 focus:bg-white focus:border-primary"
                              value={pendingFilterState[filter.param] || "all"}
                              onChange={(e) =>
                                setPendingFilterState((s) => ({
                                  ...s,
                                  [filter.param]: e.target.value,
                                }))
                              }
                              aria-label={filter.label}
                            >
                              {(filter.options as FilterOption[]).map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {filter.type === "text" && (
                            <Input
                              type="text"
                              className="w-full h-9 px-2 py-1 rounded border bg-gray-50 focus:bg-white focus:border-primary"
                              value={pendingFilterState[filter.param] || ""}
                              onChange={(e) =>
                                setPendingFilterState((s) => ({
                                  ...s,
                                  [filter.param]: e.target.value,
                                }))
                              }
                              placeholder={filter.label}
                            />
                          )}
                          {filter.type === "selectWithFetch" && "fetchUrl" in filter && (
                            <div className="w-full">
                              <SelectWithFetch className="text-[14px]"
                                fetchUrl={filter.fetchUrl}
                                value={pendingFilterState[filter.param] || ""}
                                onChange={(value) =>
                                  setPendingFilterState((s) => ({
                                    ...s,
                                    [filter.param]: value,
                                  }))
                                }
                                valueKey={filter.valueKey}
                                labelKey={filter.labelKey}
                                searchParam={filter.searchParam}
                                placeholder={filter.placeholder || filter.label}
                                labelFormatter={filter.labelFormatter}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
              {Object.values(activeFilters).some(Boolean) && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPendingFilterState({});
                      setFilterState({});
                      setActiveFilters({});
                      setFilterDropdownOpen(false);
                    }}
                    data-testid="filter-reset"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setFilterState(pendingFilterState);
                      setFilterDropdownOpen(false);
                    }}
                    data-testid="filter-apply"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
                onClick={() => exportToExcel(tableData, table, exportFileName)}
              >
                Export Current Page
              </DropdownMenuCheckboxItem>
              {/* Export All for store-based */}
              {store && (
                <DropdownMenuCheckboxItem
                  onClick={async () => {
                    let allRows: any[] = [];
                    try {
                      // Build endpoint manually using the same logic as entityFactory
                      const exportParams = { ...params, ...fixedQuery, ...filterParams, page: 1, per_page: 10000 };

                      // Get the entityEndpoint from the store API object
                      const storeApi = storeApis[store];
                      const entityEndpoint = (storeApi as any)?.entityEndpoint || store;

                      // Substitute URL parameters (e.g., :id)
                      let endpoint = entityEndpoint.replace(/:(\w+)/g, (match: string, paramName: string) => {
                        return String((exportParams as any)[paramName] || match);
                      });

                      // Filter out URL parameters from query string
                      const urlParamNames = entityEndpoint.match(/:(\w+)/g)?.map((p: string) => p.substring(1)) || [];
                      const queryParams = Object.entries(exportParams)
                        .filter(([key, value]) =>
                          value !== undefined &&
                          value !== null &&
                          String(value) !== "" &&
                          !urlParamNames.includes(key)
                        )
                        .reduce((acc, [key, value]) => {
                          acc[key] = String(value);
                          return acc;
                        }, {} as Record<string, string>);

                      // Build final URL
                      let url = `/${endpoint}`;
                      if (Object.keys(queryParams).length > 0) {
                        const queryString = new URLSearchParams(queryParams).toString();
                        url += `?${queryString}`;
                      }

                      // Make direct API call
                      const res = await apiClient.get<any>(url);
                      allRows = res.data?.items ?? res.data ?? [];
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
                      style={width ? { minWidth: width } : undefined}
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
        <div className="flex-col items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <div className="flex flex-col w-full">
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
                {pageCount > 5 && (
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={paginationInput}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/, "");
                      setPaginationInput(value);
                      const pageNum = Number(value);
                      if (
                        value &&
                        (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount)
                      ) {
                        setPaginationError(`Max page is ${pageCount}`);
                      } else {
                        setPaginationError("");
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const value = (e.target as HTMLInputElement).value;
                        const pageNum = Number(value);
                        if (
                          !value ||
                          isNaN(pageNum) ||
                          pageNum < 1 ||
                          pageNum > pageCount
                        ) {
                          setPaginationError(`Max page is ${pageCount}`);
                        } else {
                          setPaginationError("");
                          handlePageChange(pageNum - 1);
                          setPaginationInput("");
                        }
                      }
                    }}
                    onBlur={e => {
                      setPaginationInput("");
                      setPaginationError("");
                    }}
                    className="border rounded px-2 py-1 w-16 text-center mx-2"
                    placeholder="Page"
                  />
                )}
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
          {paginationError && (
            <div className="w-full flex">
              <span
                className="text-xs text-red-500 mt-1"
                style={{
                  marginLeft: `calc(${Math.min(5, pageCount)} * 2.5rem + 2.5rem)`,
                }}
              >
                {paginationError}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
