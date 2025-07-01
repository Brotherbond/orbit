import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLoading() {
  return (
    <div className="dashboard min-h-screen bg-[#f8f8f8]">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              {/* Main Spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-[#ff6600]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#ff6600] rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Loading Text */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#444444] mb-2">
                  Loading Page
                </h3>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#ff6600] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              
              {/* Content Skeleton */}
              <div className="w-full max-w-2xl mt-8 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
