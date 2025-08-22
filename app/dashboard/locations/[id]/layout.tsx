"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { LocationProvider, useLocationContext } from "./location-context";

function LocationLayoutContent({ children }: { children: React.ReactNode }) {
  const { location, isLoading } = useLocationContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!location) {
    notFound();
  }

  return <>{children}</>;
}

export default function LocationLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <LocationProvider locationId={params.id}>
      <LocationLayoutContent>
        {children}
      </LocationLayoutContent>
    </LocationProvider>
  );
}
