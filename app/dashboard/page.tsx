"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Package } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getColumns } from "./orders/page";
import { ColumnDef } from "@/components/ui/data-table-types";
import { useOrdersContext } from "./orders/orders-context";

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
  total_order_volume: number;
  total_volume: number;
  brand_category_price_data: BrandCategoryPriceData[];
}

interface DailyRevenueWithDay extends DailyRevenue {
  dayOfWeek: string;
  formattedDate: string;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const dataTableRef = useRef<{ refresh: () => void }>(null)
  const { orders, isLoading: ordersLoading } = useOrdersContext()
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()
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

  // Sort daily_revenue by date ascending and add day of week
  const sortedDailyRevenue: DailyRevenueWithDay[] = useMemo(() => {
    if (!dashboardData || !dashboardData.daily_revenue) return [];
    return [...dashboardData.daily_revenue]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => {
        const dateObj = new Date(item.date);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = String(dateObj.getFullYear()).slice(-2);
        const dayShort = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        return {
          ...item,
          dayOfWeek: dayShort,
          formattedDate: `${day}/${month}/${year}(${dayShort})`,
        };
      });
  }, [dashboardData]);

  if (isLoading || ordersLoading) {
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
                  <Tooltip />
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
                  <p className="text-2xl font-semibold text-[#444444]">₦{Number(dashboardData.total_revenue).toLocaleString()}</p>
                </div>
                <span className="h-8 w-8 text-[#12b636] flex items-center justify-center text-3xl font-bold">₦</span>
              </div>
            </CardContent>
          </Card>
          {["FnB", "PC", "Pharma"].map((category) => {
            const cat = dashboardData.brand_category_price_data.find((c) => c.category === category) || {
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
                  <p className="text-2xl font-semibold text-[#444444]">{dashboardData.total_volume}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[#ff6600]" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Brand Volume</p>
                  <p className="text-2xl font-semibold text-[#444444]">{dashboardData.total_volume}</p>
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
                data={orders.slice(0, 5)}
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
