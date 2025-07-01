"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(true)
      const timeout = setTimeout(() => setLoading(false), 600)
      setPrevPath(pathname)
      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line
  }, [pathname])

  return (
    <SessionProvider>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
        </div>
      )}
      {children}
    </SessionProvider>
  )
}
