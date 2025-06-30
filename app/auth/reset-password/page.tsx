"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PasswordField } from "@/components/ui/password-field"
import { Form, Formik } from "formik"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "@/components/auth-card"
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
        <AuthCard
          title="Set New Password"
          description="Enter your new password below"
        >
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

                <PasswordField
                  id="password"
                  name="password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <PasswordField
                  id="confirm"
                  name="confirm"
                  label="Confirm Password"
                  placeholder="Confirm new password"
                  value={values.confirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />

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
        </AuthCard>
      </div>
    </div>
  )
}
