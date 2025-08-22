"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { WarehouseProvider, useWarehouseContext } from "./warehouse-context";

function WarehouseLayoutContent({ children }: { children: React.ReactNode }) {
  const { warehouse, isLoading } = useWarehouseContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!warehouse) {
    notFound();
  }

  return <>{children}</>;
}

export default function WarehouseLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <WarehouseProvider warehouseId={params.id}>
      <WarehouseLayoutContent>
        {children}
      </WarehouseLayoutContent>
    </WarehouseProvider>
  );
}
