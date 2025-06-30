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
  const [step, setStep] = useState<"email" | "code">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Request code
  const initialEmailValues = { email: "" };
  const emailSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  // Step 2: Enter code and new password
  const initialCodeValues = { code: "", password: "", confirm: "" };
  const codeSchema = Yup.object({
    code: Yup.string().required("Code is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleEmailSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/forgot-password", { email: values.email });
      setSentEmail(values.email);
      setStep("code");
    } catch (err) {
      setError("Failed to send code. Please check your email address and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (values: { code: string; password: string; confirm: string }) => {
    setIsLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/reset-password", {
        email: sentEmail,
        code: values.code,
        password: values.password,
        password_confirmation: values.confirm,
      });
      setSuccessMsg("Your password has been reset. You can now log in.");
      setStep("email");
    } catch (err) {
      setError("Failed to reset password. Please check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthCard
          title={step === "email" ? "Reset Password" : "Enter Code"}
          description={
            step === "email"
              ? "We'll send a code to your email to reset your password"
              : `Enter the code sent to ${sentEmail} and set a new password`
          }
        >
          {successMsg && (
            <div className="mb-4">
              <Alert variant="default">
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            </div>
          )}
          {step === "email" ? (
            <Formik
              initialValues={initialEmailValues}
              validationSchema={emailSchema}
              onSubmit={handleEmailSubmit}
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
                    {isLoading ? "Sending..." : "Send code"}
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={initialCodeValues}
              validationSchema={codeSchema}
              onSubmit={handleCodeSubmit}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Field
                      as={Input}
                      id="code"
                      name="code"
                      type="text"
                      autoComplete="one-time-code"
                      placeholder="Enter code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.code}
                    />
                    <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Field
                      as={Input}
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirm}
                    />
                    <ErrorMessage name="confirm" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
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
  );
}
