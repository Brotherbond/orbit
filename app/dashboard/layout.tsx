"use client"

import Link from "next/link"
import Image from "next/image"
import type React from "react"
import Logo from "@/images/orbit-logo.png"
import { useSession } from "next-auth/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { RolesProvider } from "@/components/dashboard/RolesContext"
import { NavigationLoaderProvider, PageTransitionLoader } from "@/components/dashboard/navigation-loader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Link href="/" passHref>
            <Image src={Logo} alt="Orbit Logo" priority width={80} height={80} className="w-20 h-20 object-contain mb-4" />
          </Link>
          <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-[#ababab] text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <AuthProvider>
      <RolesProvider>
        <NavigationLoaderProvider>
          <div className="dashboard min-h-screen bg-[#f8f8f8]">
            <DashboardHeader />
            <div className="flex">
              <DashboardSidebar />
              <main className="flex-1 p-6">{children}</main>
            </div>
            <PageTransitionLoader />
          </div>
        </NavigationLoaderProvider>
      </RolesProvider>
    </AuthProvider>
  )
}
