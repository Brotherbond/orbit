"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, ApiResponse } from "./api-client"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: {
    id: string
    name: string
  }
  market?: {
    id: string
    name: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get<ApiResponse<any>>("/auth/me")
      setUser(data.item)
    } catch (error) {
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<any>>("/auth/login", { email, password })
    const { token, user } = data.item

    localStorage.setItem("token", token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
