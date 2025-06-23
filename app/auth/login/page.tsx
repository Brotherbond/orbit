"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/orbit-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const initialValues = { email: "", password: "" }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else if (result?.ok) {
        const session = await getSession()
        if (session) {
          if (callbackUrl) {
            router.push(callbackUrl)
          } else {
            router.push("/dashboard")
          }
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
            <CardTitle className="text-[#444444] text-center font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-[#ababab] text-center">Please enter your details below to sign in</CardDescription>
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

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-[#444444]">
                        Email address
                      </Label>
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
                        <Mail className="h-5 w-5 text-[#ababab] absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-[#444444]">
                        Password
                      </Label>
                      <div className="mt-1 relative">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="pl-10 pr-10"
                          placeholder="Enter your password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
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
                        <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
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
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
