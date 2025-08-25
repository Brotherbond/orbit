"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react"
import { User, Settings, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordField } from "@/components/ui/password-field"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { apiClient } from "@/lib/api-client"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { catchError } from "@/lib/utils"

const PASSWORD_INITIAL_VALUES = {
  current_password: "",
  new_password: "",
  confirm: "",
}

const PASSWORD_VALIDATION_SCHEMA = Yup.object({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Confirm your new password"),
})

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("profile")

  const roleDisplay = useMemo(() => {
    const r = session?.user?.role || ""
    return r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : "Unknown"
  }, [session?.user?.role])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "security" || tab === "profile") setActiveTab(tab)
  }, [searchParams])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set("tab", tab)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const handlePasswordSubmit = async (
    values: typeof PASSWORD_INITIAL_VALUES,
    { setFieldError }: { setFieldError: (field: string, message: string) => void }
  ) => {
    setIsPasswordLoading(true)
    setPasswordError("")
    try {
      await apiClient.post("/auth/change-password", {
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password,
      })
      toast({ title: "Success", description: "Password changed successfully!" })
    } catch (err: any) {
      catchError(err, setFieldError)
      setPasswordError(err?.message || "Failed to change password.")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ababab] text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-8 h-8 bg-[#ff6600] rounded-xl mb-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Account Settings</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your profile, security preferences, and account settings
        </p>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="max-w-4xl mx-auto px-8">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-transparent border-0 p-0">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center space-x-2 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#ff6600] data-[state=active]:bg-white data-[state=active]:text-[#ff6600] transition-all duration-200 text-base font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="flex items-center space-x-2 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#ff6600] data-[state=active]:bg-white data-[state=active]:text-[#ff6600] transition-all duration-200 text-base font-medium"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="max-w-4xl mx-auto p-8">
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-8 mt-0">
                <div className="max-w-md mx-auto">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="text-center pb-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-7 w-7 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">Personal Details</CardTitle>
                      <CardDescription className="text-gray-600">
                        View your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">First Name</Label>
                          <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                            <span className="text-gray-900">{session.user.first_name || "Not provided"}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                          <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                            <span className="text-gray-900">{session.user.last_name || "Not provided"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                        <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                          <span className="text-gray-900">{session.user.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="h-11 px-3 flex items-center justify-center md:justify-start">
                          <Badge className="bg-[#ff6600] text-white px-3 py-1 text-sm">{roleDisplay}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-8 mt-0">
                <div className="max-w-md mx-auto">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="text-center pb-6">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-7 w-7 text-red-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">Change Password</CardTitle>
                      <CardDescription className="text-gray-600">
                        Update your account password to keep it secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Formik
                        initialValues={PASSWORD_INITIAL_VALUES}
                        validationSchema={PASSWORD_VALIDATION_SCHEMA}
                        onSubmit={handlePasswordSubmit}
                      >
                        {({ values, handleChange, handleBlur }) => (
                          <Form className="space-y-6">
                            {passwordError && (
                              <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-800">{passwordError}</AlertDescription>
                              </Alert>
                            )}

                            <PasswordField
                              id="current_password"
                              name="current_password"
                              label="Current Password"
                              placeholder="Enter your current password"
                              value={values.current_password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="current-password"
                            />
                            <PasswordField
                              id="new_password"
                              name="new_password"
                              label="New Password"
                              placeholder="Enter your new password"
                              value={values.new_password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="new-password"
                            />
                            <PasswordField
                              id="confirm"
                              name="confirm"
                              label="Confirm New Password"
                              placeholder="Confirm your new password"
                              value={values.confirm}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="new-password"
                            />

                            <Button 
                              type="submit" 
                              className="w-full bg-red-600 hover:bg-red-700 text-white h-11" 
                              disabled={isPasswordLoading}
                            >
                              {isPasswordLoading ? "Updating Password..." : "Update Password"}
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
