"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"
import { GlobalLoading } from "./global-loading"
import { RouteLoadingProvider } from "./route-loading-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RouteLoadingProvider>
        {children}
      </RouteLoadingProvider>
      <GlobalLoading />
    </SessionProvider>
  )
}
