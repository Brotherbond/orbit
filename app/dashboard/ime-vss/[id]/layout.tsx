"use client"

import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { notFound } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { ImeVssProvider, useImeVssContext, useImeVssInfo } from "./ime-vss-context";
import { ViewPageHeader } from "@/components/dashboard/ViewPageHeader";

function ImeVssLayoutContent({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { imeVss, isLoading } = useImeVssContext()
  const imeVssInfo = useImeVssInfo()

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!imeVss) {
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
    { id: 'view', label: 'Overview', path: `/dashboard/ime-vss/${params.id}` },
    { id: 'orders', label: 'Orders', path: `/dashboard/ime-vss/${params.id}/orders` },
    { id: 'target', label: 'Target', path: `/dashboard/ime-vss/${params.id}/target` },
    { id: 'edit', label: 'Manage', path: `/dashboard/ime-vss/${params.id}/edit` },
  ]

  const activeTab = getActiveTab()

  return (
    <div>
      <ViewPageHeader
        title={imeVssInfo.full_name || "IME-VSS"}
        description={imeVssInfo.email || ""}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "imeVss",
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

export default function ImeVssLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <ImeVssProvider imeVssId={params.id}>
      <ImeVssLayoutContent params={params}>
        {children}
      </ImeVssLayoutContent>
    </ImeVssProvider>
  )
}
