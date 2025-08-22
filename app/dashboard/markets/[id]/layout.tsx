"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { MarketProvider, useMarketContext } from "./market-context";

function MarketLayoutContent({ children }: { children: React.ReactNode }) {
  const { market, isLoading } = useMarketContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!market) {
    notFound();
  }

  return <>{children}</>;
}

export default function MarketLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <MarketProvider marketId={params.id}>
      <MarketLayoutContent>
        {children}
      </MarketLayoutContent>
    </MarketProvider>
  );
}
