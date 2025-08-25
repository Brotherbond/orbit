"use client"

import { ViewPageHeader } from "@/components/dashboard/ViewPageHeader"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"
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
  const { distributor, isLoading, error } = useDistributor()
  const distributorInfo = useDistributorInfo()
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !distributor) {
    notFound()
  }

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
    <div>
      <ViewPageHeader
        title={distributorInfo.business_name || "Distributor"}
        description={<DistributorUserName />}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "distributors",
          uuid: params.id,
        }}
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-4">
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

function DistributorUserName() {
  const { distributor } = useDistributor()

  if (!distributor?.user) return null

  return (
    <span className="text-[#ababab]">
      {distributor.user.first_name} {distributor.user.last_name}
    </span>
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
