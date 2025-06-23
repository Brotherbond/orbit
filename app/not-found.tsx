import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotFound() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[#444444] mb-4">404</h1>
            <p className="text-lg text-[#ababab] mb-6">Page not found in dashboard.</p>
            <Link href="/dashboard">
              <span className="inline-block px-6 py-2 bg-[#ff6600] text-white rounded hover:bg-[#ff6b00] transition">
                Go to Dashboard Home
              </span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
