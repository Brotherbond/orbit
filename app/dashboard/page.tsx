"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, DollarSign, Package } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getColumns, getStatusFilter } from "./orders/page";
import { ColumnDef } from "@tanstack/react-table";

interface BrandCategoryPriceData {
  category: string;
  total_price: string;
  volume: number;
}

interface DailyRevenue {
  date: string;
  total: string;
}

interface RecentOrderBrand {
  uuid: string;
  quantity: string;
  price: string;
  info: {
    uuid: string;
    name: string;
    category: string;
    image: string;
    created_at: string;
  };
}

interface RecentOrder {
  uuid: string;
  ref: string;
  ime_vss: any;
  distributor_user: any;
  promos: any;
  brands: RecentOrderBrand[];
  total_amount: string;
  status: string;
  status_progress: any;
  created_at: string;
}

interface DashboardData {
  daily_revenue: DailyRevenue[];
  total_revenue: string;
  total_volume: number;
  brand_category_price_data: BrandCategoryPriceData[];
}



export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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
              <CardTitle className="text-[#444444]">Daily Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.daily_revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis dataKey="date" stroke="#ababab" />
                  <YAxis stroke="#ababab" />
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
                <DollarSign className="h-8 w-8 text-[#12b636]" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Volume</p>
                  <p className="text-2xl font-semibold text-[#444444]">{dashboardData.total_volume}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[#ff6600]" />
              </div>
            </CardContent>
          </Card>

          {dashboardData.brand_category_price_data.map((cat) => (
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
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#444444]">Recent Orders</CardTitle>
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
