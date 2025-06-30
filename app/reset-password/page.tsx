"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = searchParams.toString()
    router.replace(`/auth/reset-password${params ? "?" + params : ""}`)
  }, [router, searchParams])

  return null
}
