"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, AlertCircle, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/types/order"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalDistributors: number
  totalBrands: number
  revenueGrowth: number
  ordersGrowth: number
  distributorsGrowth: number
  brandsGrowth: number
}

interface RecentOrder extends Order {
  distributor: string
  amount: number

}

const chartData = [
  { name: "Jan", revenue: 45000, orders: 120 },
  { name: "Feb", revenue: 52000, orders: 140 },
  { name: "Mar", revenue: 48000, orders: 130 },
  { name: "Apr", revenue: 61000, orders: 160 },
  { name: "May", revenue: 55000, orders: 145 },
  { name: "Jun", revenue: 67000, orders: 180 },
]

const pieData = [
  { name: "Pending", value: 30, color: "#ffb800" },
  { name: "Confirmed", value: 45, color: "#12b636" },
  { name: "Delivered", value: 20, color: "#ff6600" },
  { name: "Cancelled", value: 5, color: "#ff0000" },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalDistributors: 0,
    totalBrands: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    distributorsGrowth: 0,
    brandsGrowth: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch dashboard stats
      const { data: statsData } = await apiClient.get<{ items: any }>("/orders/dashboard-stats")
      let stats: DashboardStats = {
        totalRevenue: 0,
        totalOrders: 0,
        totalDistributors: 0,
        totalBrands: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        distributorsGrowth: 0,
        brandsGrowth: 0,
      }
      if (statsData && statsData.items) {
        const items = statsData.items
        stats = {
          totalRevenue: 0,
          totalOrders: (items.pending ?? 0) + (items.confirmed ?? 0) + (items.fulfilled ?? 0),
          totalDistributors: 0,
          totalBrands: 0,
          revenueGrowth: 0,
          ordersGrowth: 0,
          distributorsGrowth: 0,
          brandsGrowth: 0,
        }
      }
      setStats(stats)

      // Fetch recent orders
      const { data: ordersData } = await apiClient.get<{ items: any }>("/orders/recent?recent_orders_count=5")
      if (ordersData && ordersData.items) {
        const mappedOrders: RecentOrder[] = ordersData.items.map((order: any) => ({
          id: order.uuid ?? "",
          ref: order.ref ?? "",
          distributor: order.distributor_user?.distributor_details?.business_name ?? order.distributor_user?.full_name ?? "Unknown",
          amount: Number(order.total_amount ?? 0),
          status: order.status ?? "unknown",
          createdAt: order.created_at ?? "",
        }))
        setRecentOrders(mappedOrders)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Dashboard</h1>
          <p className="text-[#ababab]">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <Button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Quick Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full dashboard-charts">
        {/* Revenue & Orders Trend Chart */}
        <div className="flex flex-col justify-between w-full">
          <Card className="h-full card-hover">
            <CardHeader>
              <CardTitle className="text-[#444444]">Revenue & Orders Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                  <XAxis dataKey="name" stroke="#ababab" />
                  <YAxis stroke="#ababab" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#ff6600" />
                  <Bar dataKey="orders" fill="#12b636" />
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
                  <p className="text-2xl font-semibold text-[#444444]">₦{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#12b636]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                <span className="text-sm text-[#12b636]">+{stats.revenueGrowth}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Total Orders</p>
                  <p className="text-2xl font-semibold text-[#444444]">{stats.totalOrders.toLocaleString()}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-[#ff6600]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                <span className="text-sm text-[#12b636]">+{stats.ordersGrowth}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Distributors</p>
                  <p className="text-2xl font-semibold text-[#444444]">{stats.totalDistributors.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-[#ffb800]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                <span className="text-sm text-[#12b636]">+{stats.distributorsGrowth}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#ababab]">Active Brands</p>
                  <p className="text-2xl font-semibold text-[#444444]">{stats.totalBrands.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-[#1cd344]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                <span className="text-sm text-[#12b636]">+{stats.brandsGrowth}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#444444]">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.ref} className="flex items-center justify-between p-4 bg-[#f2f2f2] rounded-lg">
                  <div>
                    <p className="font-medium text-[#444444]">{order.distributor}</p>
                    <p className="text-sm text-[#ababab]">Order #{order.ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#444444]">₦{order.amount.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full status ${order.status} `}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-[#ababab] mx-auto mb-4" />
              <p className="text-[#ababab]">No recent orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
