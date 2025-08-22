"use client"

import { getColumns } from "@/app/dashboard/orders/page";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function ImeVssOrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const columns = React.useMemo(() => getColumns(session, router), [session, router]);
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
      />
    </div>
  );
}
