"use client";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { UserProvider, useUserContext } from "./user-context";

function UserLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    notFound();
  }

  return <>{children}</>;
}

export default function UserLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <UserProvider userId={params.id}>
      <UserLayoutContent>
        {children}
      </UserLayoutContent>
    </UserProvider>
  );
}
