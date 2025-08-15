"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { DistributorProvider, useDistributor, useDistributorInfo } from "./distributor-context"

function DistributorLayoutContent({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const distributorInfo = useDistributorInfo()
  const isLoading = !distributorInfo.business_name

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (pathname.includes('/edit')) return 'edit'
    if (pathname.includes('/orders')) return 'orders'
    if (pathname.includes('/target')) return 'target'
    return 'view'
  }

  const tabs = [
    { id: 'view', label: 'Overview', path: `/dashboard/distributors/${params.id}` },
    { id: 'orders', label: 'Orders', path: `/dashboard/distributors/${params.id}/orders` },
    { id: 'target', label: 'Target', path: `/dashboard/distributors/${params.id}/target` },
    { id: 'edit', label: 'Manage', path: `/dashboard/distributors/${params.id}/edit` },
  ]

  const activeTab = getActiveTab()

  return (
    <div className="space-y-6">
      {/* Header with Distributor Name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/distributors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-[#444444]">
                  {distributorInfo.business_name || "Distributor"}
                </h1>
                <DistributorUserName />
              </>
            )}
          </div>
        </div>
      </div>

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

// Separate component for user name to avoid unnecessary re-renders
function DistributorUserName() {
  const { distributor } = useDistributor()

  if (!distributor?.user) return null

  return (
    <p className="text-[#ababab]">
      {distributor.user.first_name} {distributor.user.last_name}
    </p>
  )
}

export default function DistributorLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <DistributorProvider distributorId={params.id}>
      <DistributorLayoutContent params={params}>
        {children}
      </DistributorLayoutContent>
    </DistributorProvider>
  )
}
