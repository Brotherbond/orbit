"use client"

import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetDashboardQuery } from "@/store/dashboard-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getColumns } from "./orders/page";
import { ColumnDef } from "@/components/ui/data-table-types";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { DailyRevenueWithDay } from "@/types/dashboard";


export default function DashboardPage() {
  const dateRange = useSelector((state: RootState) => state.dashboardFilters.dateRange);
  const { data: dashboardData, isLoading } = useGetDashboardQuery(
    dateRange && dateRange.period_type
      ? { period: dateRange.period_type }
      : undefined
  );
  const dataTableRef = useRef<{ refresh: () => void }>(null)
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()



  const columns = useMemo(
    () => getColumns(session, router, toast, () => { }),
    [session, router, toast]
  )

const sortedDailyRevenue: DailyRevenueWithDay[] = useMemo(() => {
  if (!dashboardData || !dashboardData.revenue) return [];
  const { labels = [], data = [], period_type } = dashboardData.revenue;
  return labels.map((label, idx) => {
    let formattedDate = label;
    let dayOfWeek = "";
    if (period_type === "week") {
      const dateObj = new Date(label);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).slice(-2);
      dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      formattedDate = `${day}/${month}/${year}(${dayOfWeek})`;
    }
    return {
      date: label,
      total: typeof data[idx] === "string" ? Number(data[idx]) : data[idx] ?? 0,
      dayOfWeek,
      formattedDate,
    };
  });
}, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#444444]">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }
  const filters: import("@/components/ui/data-table").FilterConfig[] = [{ type: "disableDefaultDateRange" }]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Dashboard</h1>
          <p className="text-[#ababab]">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <div className="flex items-center">
          <DateFilter />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full dashboard-charts">
        {/* Revenue Trend Chart */}
        <div className="flex flex-col justify-between w-full">
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="text-[#444444]">Daily Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedDailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis dataKey="formattedDate" stroke="#ababab" tick={{ fontSize: 10 }} />
                  <YAxis
                    stroke="#ababab"
                    tick={{ fontSize: 10 }}
                    tickFormatter={value => {
                      const n = Number(value) / 1_000_000;
                      return n === 0 ? "0" : `${n}${n === 1 ? "m" : "m"}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: string | number, name) => {
                      const formatted = `₦${Number(value).toLocaleString()}`;
                      return [formatted, "Total"];
                    }}
                  />
                  <Bar dataKey="total" fill="#ff6600" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Revenue</p>
                  <p className="text-2xl font-semibold text-[#444444]">₦{Number(dashboardData.total_revenue || 0).toLocaleString()}</p>
                </div>
                <span className="h-8 w-8 text-[#12b636] flex items-center justify-center text-3xl font-bold">₦</span>
              </div>
            </CardContent>
          </Card>
          {["FnB", "PC", "Pharma"].map((category) => {
            const cat = (dashboardData.brand_category_price_data ?? []).find(
              (c) => c.category === category
            ) || {
              category,
              total_price: "0",
              volume: 0,
            };
            return (
              <Card className="card-hover" key={cat.category}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#ababab]">{cat.category} Revenue</p>
                      <p className="text-2xl font-semibold text-[#444444]">₦{Number(cat.total_price).toLocaleString()}</p>
                    </div>
                    <Package className="h-8 w-8 text-[#1cd344]" />
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-[#12b636]">Volume: {cat.volume}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Brand Volume</p>
                  <p className="text-2xl font-semibold text-[#444444]">{dashboardData.total_volume || 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[#ff6600]" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Order Volume</p>
                  <p className="text-2xl font-semibold text-[#444444]">{dashboardData.total_order_volume || 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[#ff6600]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#444444]">Recent Orders</CardTitle>
          <Link
            href="/dashboard/orders"
            className="text-sm text-[#ff6600] hover:underline font-medium"
            aria-label="See all orders"
          >
            See All
          </Link>
        </CardHeader>
        <CardContent>
          <div style={{ margin: "-1.5rem -1.5rem 0 -1.5rem" }}>
            <style>{`
              .dashboard-hide-header .flex.items-center.justify-between.py-4 {
                display: none !important;
              }
            `}</style>
            <div className="dashboard-hide-header">
              <DataTable className="no-card"
                ref={dataTableRef}
                columns={columns as unknown as ColumnDef<unknown, unknown>[]}
                store="orders"
                per_page={5}
                filters={filters}
                exportFileName="recent-orders.xlsx"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
