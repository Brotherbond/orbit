"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

function DistributorLayoutContent({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (pathname.includes('/orders')) return 'orders'
    if (pathname.includes('/sales')) return 'sales'
    if (pathname.includes('/ime-vss')) return 'ime-vss'
    return 'view'
  }

  const tabs = [
    { id: 'orders', label: 'Order Lead Time', path: `/dashboard/reports/orders` },
    { id: 'sales', label: 'Sales', path: `/dashboard/reports/sales` },
    { id: 'ime-vss', label: 'IME/VSS Performance', path: `/dashboard/reports/ime-vss` },
  ]

  const activeTab = getActiveTab()

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={cn(
                "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}


export default function DistributorLayout({ children, }: { children: React.ReactNode }) {
  return (
    <DistributorLayoutContent>
      {children}
    </DistributorLayoutContent>
  )
}
