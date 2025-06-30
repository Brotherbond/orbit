"use client"


import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { ArrowLeft, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "@/components/auth-card"
import { useState } from "react"
import * as Yup from "yup"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [sentEmail, setSentEmail] = useState("")

  const initialValues = { email: "" }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  })

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true)
    setError("")
    try {
      await apiClient.post("/auth/forgot-password", { email: values.email })
      setSentEmail(values.email)
      setIsSuccess(true)
    } catch (err) {
      setError("Failed to send reset email. Please check your email address and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        <AuthCard
          title="Check your email"
          description={`We've sent a password reset link to ${sentEmail}`}
        >
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Didn't receive the email? Check your spam folder or{" "}
            <button onClick={() => setIsSuccess(false)} className="text-orange-600 hover:text-orange-500">
              try again
            </button>
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </AuthCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthCard
          title="Reset Password"
          description="We'll send you a secure link to reset your password"
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

                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="mt-1 relative">
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="pl-10"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <p className="text-xs text-gray-600">
                  Can’t remember your Email Address? <Link href="/contact">Contact Admin</Link>
                </p>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
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
