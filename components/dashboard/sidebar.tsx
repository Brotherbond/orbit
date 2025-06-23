"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  MapPin,
  Building2,
  FileText,
  Settings,
  Shield,
  UserCheck,
  LogOut,
} from "lucide-react"
import { useSession } from "next-auth/react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["everybody"],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    roles: ["everybody"],
  },
  {
    title: "Distributors",
    href: "/dashboard/distributors",
    icon: UserCheck,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "IME/VSS",
    href: "/dashboard/ime-vss",
    icon: Users,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["super-admin"],
  },
  {
    title: "Brands",
    href: "/dashboard/brands",
    icon: Package,
    roles: ["super-admin", "operations"],
  },
  {
    title: "Markets",
    href: "/dashboard/markets",
    icon: Building2,
    roles: ["super-admin", "operations", "sales-admin"],
  },
  {
    title: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
    roles: ["super-admin", "operations"],
  },
  {
    title: "Roles & Permissions",
    href: "/dashboard/roles",
    icon: Shield,
    roles: ["super-admin"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["everybody"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["everybody"],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() || "";

  const activeItem = menuItems
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" })
  }

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes("everybody") || item.roles.includes(userRole)
  )

  return (
    <aside className="w-64 bg-white border-r border-[#eeeeee] min-h-screen">
      <div className="p-4">
        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = activeItem && item.href === activeItem.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive ? "btn-primary" : "hover:bg-[#f2f2f2]"}`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-[#f2f2f2]"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  )
}
