"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/images/orbit-logo.png"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { ArrowLeft, CheckCircle, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import * as Yup from "yup"
import { resetPassword } from "./actions"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  // Redirect to login if missing token or email
  useEffect(() => {
    if (!token || !email) {
      router.replace("/auth/login")
    }
  }, [token, email, router])

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const initialValues = { password: "", confirm: "" }

  const validationSchema = Yup.object({
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  })

  const handleSubmit = async (values: { password: string; confirm: string }) => {
    setIsLoading(true)
    setError("")
    try {
      const result = await resetPassword({ token, email, password: values.password })
      if (!result.success) {
        setError(result.message || "Failed to reset password.")
      } else {
        setIsSuccess(true)
        setTimeout(() => router.push("/auth/login"), 2000)
      }
    } catch {
      setError("Network error.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="mt-4">Password Reset Successful</CardTitle>
              <CardDescription>Your password has been updated. Redirecting to login...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="rounded-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mx-auto mb-4">
              <Link href="/" passHref>
                <Image
                  src={Logo}
                  alt="Orbit Logo"
                  width={120}
                  height={120}
                  className="h-21 w-21 object-contain drop-shadow-lg"
                  priority
                />
              </Link>
            </div>
            <CardTitle className="text-center font-bold">Set New Password</CardTitle>
            <CardDescription className="text-center">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <div className="mt-1 relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="pl-10"
                        placeholder="Enter new password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <div className="mt-1 relative">
                      <Field
                        as={Input}
                        id="confirm"
                        name="confirm"
                        type="password"
                        autoComplete="new-password"
                        className="pl-10"
                        placeholder="Confirm new password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirm}
                      />
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <ErrorMessage name="confirm" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-6">
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
