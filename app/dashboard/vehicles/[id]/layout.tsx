"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { VehicleProvider, useVehicleContext } from "./vehicle-context";

function VehicleLayoutContent({ children }: { children: React.ReactNode }) {
  const { vehicle, isLoading } = useVehicleContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!vehicle) {
    notFound();
  }

  return <>{children}</>;
}

export default function VehicleLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <VehicleProvider vehicleId={params.id}>
      <VehicleLayoutContent>
        {children}
      </VehicleLayoutContent>
    </VehicleProvider>
  );
}
