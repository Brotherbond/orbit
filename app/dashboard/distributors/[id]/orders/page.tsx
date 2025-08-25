"use client"

import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@/components/ui/data-table-types";
import { DISTRIBUTOR_ORDER_FILTERS } from "@/lib/filters/orders";
import { useOrderColumns } from "@/hooks/useOrderColumns";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

export default function DistributorOrdersPage() {
  const { columns } = useOrderColumns();
  const { data: session } = useSession();
  const routeParams = useParams();
  const distributorId = routeParams?.id as string;
  const user = session?.user;
  const role = user?.role;
  const urlParams = React.useMemo(() => ({ id: distributorId, }), [distributorId]);
  const fixedQuery = React.useMemo(() => {
    const query: Record<string, any> = {};
    if (role === "treasury") {
      query.status = "pending";
    } else if (role === "sales-admin") {
      query.status = "confirmed";
    }

    return query;
  }, [role]);

  return (
    <div>
      <DataTable
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        searchKey="ref"
        searchPlaceholder="Search orders..."
        store="distributorOrders"
        params={urlParams}
        fixedQuery={fixedQuery}
        exportFileName="Distributor-Orders.xlsx"
        filters={DISTRIBUTOR_ORDER_FILTERS}
      />
    </div>
  );
}
