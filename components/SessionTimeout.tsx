"use client"

import { signOut } from "next-auth/react"
import { useEffect, useRef } from "react"


const TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_IN_MINUTES || 15) * 60 * 1000

export default function SessionTimeout() {
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => {
                signOut({ callbackUrl: "/auth/login" });
            }, TIMEOUT_MS)
        }

        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "touchstart",
            "scroll",
        ]

        activityEvents.forEach((event) =>
            window.addEventListener(event, resetTimer)
        )

        resetTimer()

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            activityEvents.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            )
        }
    }, [])

    return null
}
