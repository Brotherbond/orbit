"use client";
import { WarehouseProvider } from "./warehouse-context";

export default function WarehouseLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <WarehouseProvider warehouseId={params.id}>
      {children}
    </WarehouseProvider>
  );
}
