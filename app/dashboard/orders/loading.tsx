import { Suspense } from 'react'

function OrdersLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
        <p className="text-sm text-gray-600">Loading orders...</p>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <Suspense fallback={<OrdersLoadingFallback />}>
      <OrdersLoadingFallback />
    </Suspense>
  )
}
