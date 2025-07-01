"use client"

import { useLoadingStore } from '@/hooks/use-loading'

export function GlobalLoading() {
  const { isLoading, loadingMessage } = useLoadingStore()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
        {loadingMessage && (
          <p className="text-sm text-gray-600 font-medium">{loadingMessage}</p>
        )}
      </div>
    </div>
  )
}
