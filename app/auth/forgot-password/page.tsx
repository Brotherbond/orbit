"use client"


import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { ArrowLeft, CheckCircle, Eye, EyeOff, Mail } from "lucide-react"
import Link from "next/link"
import { AuthCard } from "@/components/auth-card"
import { useState } from "react"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [validatedCode, setValidatedCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Request code
  const initialEmailValues = { email: "" };
  const emailSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  // Step 2: Enter code only
  const initialCodeValues = { code: "" };
  const codeSchema = Yup.object({
    code: Yup.string().required("Code is required"),
  });

  // Step 3: Enter new password
  const initialPasswordValues = { password: "", confirm: "" };
  const passwordSchema = Yup.object({
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

  const handleCodeSubmit = async (values: { code: string }) => {
    setIsLoading(true);
    setError("");
    try {
      // Validate the reset code
      await apiClient.post("/auth/validate-reset-code", {
        email: sentEmail,
        reset_code: values.code,
      });

      setValidatedCode(values.code);
      setStep("password");
    } catch (err) {
      setError("Invalid code. Please check and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: { password: string; confirm: string }) => {
    setIsLoading(true);
    setError("");
    try {
      // Reset the password using the validated code
      await apiClient.post("/auth/reset-password", {
        email: sentEmail,
        reset_code: validatedCode,
        password: values.password,
        password_confirmation: values.confirm,
      });

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in.",
        variant: "default",
      });

      router.push("/auth/login");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAgain = async () => {
    setIsLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/forgot-password", { email: sentEmail });
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
        variant: "default",
      });
    } catch (err) {
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthCard
          title={
            step === "email"
              ? "Reset Password"
              : step === "code"
                ? "Verify Code"
                : "Set New Password"
          }
          description={
            step === "email"
              ? "We'll send a code to your email to reset your password"
              : step === "code"
                ? `Enter the 6-digit code sent to ${sentEmail}`
                : "Create a new secure password for your account"
          }
        >

          {step === "email" && (
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
                    Can&apos;t remember your Email Address? <Link href="/contact">Contact Admin</Link>
                  </p>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send code"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {step === "code" && (
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
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <Mail className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        We&apos;ve sent a 6-digit verification code to<br />
                        <span className="font-medium text-gray-900">{sentEmail}</span>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="code" className="sr-only">Verification Code</Label>
                      <Field
                        as={Input}
                        id="code"
                        name="code"
                        type="text"
                        autoComplete="one-time-code"
                        className="text-center text-2xl font-mono tracking-widest h-14"
                        placeholder="000000"
                        maxLength={6}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.code}
                      />
                      <ErrorMessage name="code" component="div" className="text-red-500 text-xs mt-2 text-center" />
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Didn&apos;t receive the code?{" "}
                        <button
                          type="button"
                          className="text-orange-600 hover:text-orange-700 font-medium"
                          onClick={handleSendAgain}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send again"}
                        </button>
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {step === "password" && (
            <Formik
              initialValues={initialPasswordValues}
              validationSchema={passwordSchema}
              onSubmit={handlePasswordSubmit}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Code verified successfully!<br />
                      Now create your new password.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <div className="mt-1 relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10"
                        placeholder="Enter new password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
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
                  <div>
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <div className="mt-1 relative">
                      <Field
                        as={Input}
                        id="confirm"
                        name="confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10"
                        placeholder="Confirm new password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirm}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-[#ababab]" />
                        ) : (
                          <Eye className="h-5 w-5 text-[#ababab]" />
                        )}
                      </button>
                    </div>
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
