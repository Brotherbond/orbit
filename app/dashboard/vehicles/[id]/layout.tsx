"use client";
import { VehicleProvider } from "./vehicle-context";

export default function VehicleLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <VehicleProvider vehicleId={params.id}>
      {children}
    </VehicleProvider>
  );
}
