"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { SettingProvider, useSettingContext } from "./setting-context";

function SettingLayoutContent({ children }: { children: React.ReactNode }) {
  const { setting, isLoading } = useSettingContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!setting) {
    notFound();
  }

  return <>{children}</>;
}

export default function SettingLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <SettingProvider settingId={params.id}>
      <SettingLayoutContent>
        {children}
      </SettingLayoutContent>
    </SettingProvider>
  );
}
