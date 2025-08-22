"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { RoleProvider, useRoleContext } from "./role-context";

function RoleLayoutContent({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useRoleContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!role) {
    notFound();
  }

  return <>{children}</>;
}

export default function RoleLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <RoleProvider roleId={params.id}>
      <RoleLayoutContent>
        {children}
      </RoleLayoutContent>
    </RoleProvider>
  );
}
