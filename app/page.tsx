"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Bell,
  Settings,
  User,
  Home,
  FileText,
  BarChart3,
  Package,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
]

const pieData = [
  { name: "Desktop", value: 400, color: "#ff6600" },
  { name: "Mobile", value: 300, color: "#12b636" },
  { name: "Tablet", value: 200, color: "#ffb800" },
]

const tableData = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", date: "2024-01-15", amount: "$1,200" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", date: "2024-01-14", amount: "$850" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active", date: "2024-01-13", amount: "$2,100" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", status: "Inactive", date: "2024-01-12", amount: "$650" },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "Active",
    date: "2024-01-11",
    amount: "$1,800",
  },
]

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [session, status, router])

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Show loading state while redirecting
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#ff6600] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">DQ</span>
          </div>
          <p className="text-[#ababab]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <header className="bg-white border-b border-[#eeeeee] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#ff6600] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-semibold text-[#444444]">Business Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-[#ababab]" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-[#ababab]" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-[#ababab]" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#eeeeee] min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "analytics" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "users" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "products" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "orders" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "reports" ? "bg-[#ff6600] hover:bg-[#ff6b00]" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#444444]">Dashboard Overview</h2>
                <Button className="bg-[#ff6600] hover:bg-[#ff6b00]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#ababab]">Total Revenue</p>
                        <p className="text-2xl font-semibold text-[#444444]">$45,231</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-[#12b636]" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                      <span className="text-sm text-[#12b636]">+12.5%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#ababab]">Total Users</p>
                        <p className="text-2xl font-semibold text-[#444444]">2,350</p>
                      </div>
                      <Users className="h-8 w-8 text-[#ff6600]" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                      <span className="text-sm text-[#12b636]">+8.2%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#ababab]">Orders</p>
                        <p className="text-2xl font-semibold text-[#444444]">1,429</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-[#ffb800]" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                      <span className="text-sm text-[#12b636]">+15.3%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#ababab]">Conversion Rate</p>
                        <p className="text-2xl font-semibold text-[#444444]">3.24%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-[#1cd344]" />
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-[#12b636] mr-1" />
                      <span className="text-sm text-[#12b636]">+2.1%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#444444]">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="name" stroke="#ababab" />
                        <YAxis stroke="#ababab" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ff6600" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#444444]">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#444444]">User Management</h2>
                <Button className="bg-[#ff6600] hover:bg-[#ff6b00]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#ababab]" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#eeeeee]">
                        <TableHead className="text-[#444444]">Name</TableHead>
                        <TableHead className="text-[#444444]">Email</TableHead>
                        <TableHead className="text-[#444444]">Status</TableHead>
                        <TableHead className="text-[#444444]">Date</TableHead>
                        <TableHead className="text-[#444444]">Amount</TableHead>
                        <TableHead className="text-[#444444]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((user) => (
                        <TableRow key={user.id} className="border-[#eeeeee]">
                          <TableCell className="text-[#444444]">{user.name}</TableCell>
                          <TableCell className="text-[#ababab]">{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "Active"
                                  ? "default"
                                  : user.status === "Pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={
                                user.status === "Active"
                                  ? "bg-[#12b636] hover:bg-[#1cd344]"
                                  : user.status === "Pending"
                                    ? "bg-[#ffb800]"
                                    : "bg-[#ff0000]"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#ababab]">{user.date}</TableCell>
                          <TableCell className="text-[#444444] font-medium">{user.amount}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#444444]">Analytics</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">Last 7 days</Button>
                  <Button variant="outline">Last 30 days</Button>
                  <Button className="bg-[#ff6600] hover:bg-[#ff6b00]">Custom Range</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#444444]">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                        <XAxis dataKey="name" stroke="#ababab" />
                        <YAxis stroke="#ababab" />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#ff6600" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#444444]">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#f2f2f2] rounded-lg">
                      <span className="text-[#444444]">Page Views</span>
                      <span className="font-semibold text-[#444444]">125,430</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f2f2f2] rounded-lg">
                      <span className="text-[#444444]">Unique Visitors</span>
                      <span className="font-semibold text-[#444444]">45,230</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f2f2f2] rounded-lg">
                      <span className="text-[#444444]">Bounce Rate</span>
                      <span className="font-semibold text-[#444444]">32.5%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#f2f2f2] rounded-lg">
                      <span className="text-[#444444]">Avg. Session Duration</span>
                      <span className="font-semibold text-[#444444]">4m 32s</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(activeTab === "products" || activeTab === "orders" || activeTab === "reports") && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#444444]">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <Button className="bg-[#ff6600] hover:bg-[#ff6b00]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add {activeTab.slice(0, -1)}
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#f2f2f2] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-[#ababab]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#444444] mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                    </h3>
                    <p className="text-[#ababab] mb-4">
                      Manage your {activeTab} efficiently with our comprehensive tools.
                    </p>
                    <Button className="bg-[#ff6600] hover:bg-[#ff6b00]">Get Started</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
