import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Authentication",
  description: "Auth pages for Orbit",
};

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
