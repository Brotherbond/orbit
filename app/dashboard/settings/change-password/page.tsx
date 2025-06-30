"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { PasswordField } from "@/components/ui/password-field"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { apiClient } from "@/lib/api-client"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const initialValues = {
    current_password: "",
    new_password: "",
    confirm: "",
  }

  const validationSchema = Yup.object({
    current_password: Yup.string().required("Current password is required"),
    new_password: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm your new password"),
  })

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true)
    setError("")
    try {
      await apiClient.post("/auth/change-password", {
        current_password: values.current_password,
        password: values.new_password,
        password_confirmation: values.new_password,
      })
      setIsSuccess(true)
      setTimeout(() => router.push("/dashboard/settings"), 2000)
    } catch (err: any) {
      setError(err?.message || "Failed to change password.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            type="button"
            variant="ghost"
            className="flex items-center"
            onClick={() => router.back()}
          >
            <span className="mr-2">←</span>
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#444444]">Change Password</h1>
            <p className="text-[#ababab]">Update your account password below</p>
          </div>
        </div>
        <div className="text-center text-green-600 font-semibold mb-4">Password changed!</div>
        <Button className="w-full max-w-md" onClick={() => router.push("/dashboard/settings")}>
          Back to Settings
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          type="button"
          variant="ghost"
          className="flex items-center"
          onClick={() => router.back()}
        >
          <span className="mr-2">←</span>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">Change Password</h1>
          <p className="text-[#ababab]">Update your account password below</p>
        </div>
      </div>
      <div className="max-w-md">
        <Card className="p-6">
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
                  id="current_password"
                  name="current_password"
                  label="Current Password"
                  placeholder="Enter current password"
                  value={values.current_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                <PasswordField
                  id="new_password"
                  name="new_password"
                  label="New Password"
                  placeholder="Enter new password"
                  value={values.new_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <PasswordField
                  id="confirm"
                  name="confirm"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={values.confirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  )
}
