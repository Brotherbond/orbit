"use client"
import { Button } from "@/components/ui/button"
import {
  Building2,
  FileText,
  History,
  Home,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  UserCheck,
  Users,
  Warehouse,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

import { routeRoles } from "@/lib/route-roles"

type IconType = React.ComponentType<{ className?: string }>;

const iconMap: Record<string, IconType> = {
  Dashboard: Home,
  Orders: ShoppingCart,
  Distributors: UserCheck,
  "IME/VSS": Users,
  Users: Users,
  Brands: Package,
  Markets: Building2,
  Locations: MapPin,
  Deliveries: PackageCheck,
  Vehicles: Truck,
  Warehouses: Warehouse,
  "Roles & Permissions": Shield,
  Reports: FileText,
  "Audit Logs": History,
  Settings: Settings,
};

const handleLogout = async () => {
  await signOut({ callbackUrl: "/auth/login" });
};

function SidebarMenu({
  items,
  activeHref,
}: {
  items: typeof routeRoles;
  activeHref: string | undefined;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = activeHref === item.href;
        const Icon = iconMap[item.title] || Home;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isActive ? "btn-primary" : "hover:bg-[#f2f2f2]"}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() || "";

  const visibleMenuItems = React.useMemo(
    () =>
      routeRoles.filter(
        (item) => item.roles.includes("everybody") || item.roles.includes(userRole)
      ),
    [userRole]
  );

  const activeItem = React.useMemo(
    () =>
      routeRoles
        .filter(
          (item) => pathname === item.href || pathname.startsWith(item.href + "/")
        )
        .sort((a, b) => b.href.length - a.href.length)[0],
    [pathname]
  );

  return (
    <aside className="w-64 bg-white border-r border-[#eeeeee] min-h-screen">
      <div className="p-4">
        <nav className="space-y-1">
          <SidebarMenu items={visibleMenuItems} activeHref={activeItem?.href} />
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
  );
}
