"use client"

import { useRouteLoading } from '@/hooks/use-loading'

export function RouteLoadingProvider({ children }: { children: React.ReactNode }) {
  useRouteLoading()
  return <>{children}</>
}
