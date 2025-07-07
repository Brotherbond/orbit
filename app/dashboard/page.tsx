"use client"

import { startOfWeek, addDays, format } from "date-fns";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getColumns, getStatusFilter } from "./orders/page";
import { ColumnDef } from "@/components/ui/data-table-types";

interface BrandCategoryPriceData {
  category: string;
  total_price: string;
  volume: number;
}

interface DailyRevenue {
  date: string;
  total: string;
}

interface DashboardData {
  daily_revenue: DailyRevenue[];
  total_revenue: string;
  total_volume: number;
  brand_category_price_data: BrandCategoryPriceData[];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({ daily_revenue: [], total_revenue: "0", total_volume: 0, brand_category_price_data: [] });
  const [isLoading, setIsLoading] = useState(true)
  const dataTableRef = useRef<{ refresh: () => void }>(null)
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const role = user?.role
  const statusFilter = getStatusFilter(role);
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<{ items: any }>("/admin/dashboard/sales-admin");
      if (res.data && res.data.items) {
        setDashboardData(res.data.items);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshTable = useCallback(() => {
    dataTableRef.current?.refresh();
    fetchDashboardData();
  }, [fetchDashboardData]);

  const columns = useMemo(
    () => getColumns(session, router, toast, refreshTable),
    [session, router, toast, refreshTable]
  )

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getFullWeekWithRevenue = (revenueData: DailyRevenue[]): { date: string; total: string; label: string }[] => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });

    const map: Record<string, string> = {};
    revenueData.forEach((item) => {
      map[item.date] = item.total;
    });

    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayStr = format(date, "EEE");
      return {
        date: dateStr,
        total: map[dateStr] ?? "0",
        label: `${dateStr} (${dayStr})`,
      };
    });
  };

  const revenueDataWithWeekday = useMemo(() => {
    return getFullWeekWithRevenue(dashboardData.daily_revenue);
  }, [dashboardData.daily_revenue]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Dashboard</h1>
          <p className="text-[#ababab]">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full dashboard-charts">
        {/* Revenue Trend Chart */}
        <div className="flex flex-col justify-between w-full">
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="text-[#ff6600]">TOTAL ORDER VALUE</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueDataWithWeekday}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis dataKey="label" stroke="#ababab" />
                  <YAxis stroke="#ababab" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#ff6600" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Demand Card */}
        <Card className="h-full card-hover flex flex-col gap-1">
          <CardHeader>
            <CardTitle className="text-[#ff6600]">DEMAND</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row gap-4 mb-4">
              {/* Total Value Card */}
              <div className="flex-1 bg-white rounded shadow border">
                <div className="bg-[#ff6600] text-white px-4 py-2 rounded-t text-xs font-semibold">
                  GROSS TOTAL VALUE
                </div>
                <div className="px-4 py-4 text-2xl font-bold text-[#444444]">
                  ₦{Number(dashboardData.total_revenue).toLocaleString()}
                </div>
                <div className="px-4 py-2 text-xs text-[#ababab] border-t">
                  Total Confirmed Orders
                </div>
              </div>
              {/* Total Volume Card */}
              <div className="flex-1 bg-white rounded shadow border">
                <div className="bg-[#ff6600] text-white px-4 py-2 rounded-t text-xs font-semibold">
                  TOTAL VOLUME
                </div>
                <div className="px-4 py-4 text-2xl font-bold text-[#444444]">
                  {dashboardData.total_volume}
                </div>
                <div className="px-4 py-2 text-xs text-[#ababab] border-t">
                  Total Number of Packs Sold
                </div>
              </div>
            </div>
            {/* Brand Category Table */}
            <div>
              <table className="min-w-full text-sm border rounded">
                <thead>
                  <tr className="bg-[#f5f5f5]">
                    <th className="px-3 py-2 text-left font-medium text-[#444444]">TYPE</th>
                    <th className="px-3 py-2 text-left font-medium text-[#444444]">VALUE (₦)</th>
                    <th className="px-3 py-2 text-left font-medium text-[#444444]">VOLUME</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.brand_category_price_data.map((cat) => (
                    <tr key={cat.category} className="border-t">
                      <td className="px-3 py-2">{cat.category}</td>
                      <td className="px-3 py-2">₦{Number(cat.total_price).toLocaleString()}</td>
                      <td className="px-3 py-2">{cat.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
                url="/orders"
                perPage={5}
                exportFileName="recent-orders.xlsx"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
