"use client"

import type React from "react"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else if (result?.ok) {
        // Get the session to ensure it's properly set
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#ff6600] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">DQ</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#444444]">Sign in to DepleteIQ</h2>
          <p className="mt-2 text-sm text-[#ababab]">Manage your business operations efficiently</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Welcome back</CardTitle>
            <CardDescription className="text-[#ababab]">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-[#444444]">
                    Email address
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                    <Mail className="h-5 w-5 text-[#ababab] absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-[#444444]">
                    Password
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                    />
                    <Lock className="h-5 w-5 text-[#ababab] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#ababab]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#ababab]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#ff6600] focus:ring-[#ff6600] border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-me" className="ml-2 text-sm text-[#444444]">
                    Remember me
                  </Label>
                </div>

                <Link href="/auth/forgot-password" className="text-sm text-[#ff6600] hover:text-[#ff6b00]">
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
