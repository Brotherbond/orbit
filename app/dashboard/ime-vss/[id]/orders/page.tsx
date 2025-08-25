"use client"

import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { ORDER_FILTERS } from "@/lib/filters/orders";
import { useOrderColumns } from "@/hooks/useOrderColumns";
import { useParams } from "next/navigation";
import React from "react";

export default function ImeVssOrdersPage() {
  const { columns } = useOrderColumns();
  const routeParams = useParams();
  const imeVssId = routeParams?.id as string;
  const fixedQuery = React.useMemo(() => ({ ime_vss: imeVssId }), [imeVssId]);

  return (
    <div>
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        store="orders"
        fixedQuery={fixedQuery}
        exportFileName="IME-VSS-Orders.xlsx"
        filters={ORDER_FILTERS}
      />
    </div>
  );
}
