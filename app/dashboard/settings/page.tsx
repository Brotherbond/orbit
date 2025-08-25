"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { User, Mail, Shield, Edit, Save, X, Key, Settings, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordField } from "@/components/ui/password-field"
import { Form, Formik } from "formik"
import { useRouter } from "next/navigation"
import * as Yup from "yup"
import { apiClient } from "@/lib/api-client"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  
  // Profile state
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: session?.user?.first_name || "",
    last_name: session?.user?.last_name || "",
    email: session?.user?.email || "",
  })

  // Password change state
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Profile handlers
  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      first_name: session?.user?.first_name || "",
      last_name: session?.user?.last_name || "",
      email: session?.user?.email || "",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      first_name: session?.user?.first_name || "",
      last_name: session?.user?.last_name || "",
      email: session?.user?.email || "",
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          first_name: formData.first_name,
          last_name: formData.last_name,
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
        }
      })
      
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Password change handlers
  const passwordInitialValues = {
    current_password: "",
    new_password: "",
    confirm: "",
  }

  const passwordValidationSchema = Yup.object({
    current_password: Yup.string().required("Current password is required"),
    new_password: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
    confirm: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm your new password"),
  })

  const handlePasswordSubmit = async (values: typeof passwordInitialValues) => {
    setIsPasswordLoading(true)
    setPasswordError("")
    try {
      await apiClient.post("/auth/change-password", {
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password,
      })
      toast({
        title: "Success",
        description: "Password changed successfully!",
      })
      // Reset form
      setPasswordError("")
    } catch (err: any) {
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
                    <p className="text-gray-600">Update your personal details and contact information</p>
                  </div>
                  {!isEditing ? (
                    <Button 
                      onClick={handleEdit} 
                      className="bg-[#ff6600] hover:bg-[#e55a00] text-white px-6 py-2"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-6 py-2"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Information */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-gray-200 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg text-gray-900">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          Personal Details
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Your basic information and contact details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
                            {isEditing ? (
                              <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => handleInputChange("first_name", e.target.value)}
                                placeholder="Enter your first name"
                                className="h-11 border-gray-300 focus:border-[#ff6600] focus:ring-[#ff6600]/20"
                              />
                            ) : (
                              <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                                <span className="text-gray-900">
                                  {session.user.first_name || "Not provided"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
                            {isEditing ? (
                              <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => handleInputChange("last_name", e.target.value)}
                                placeholder="Enter your last name"
                                className="h-11 border-gray-300 focus:border-[#ff6600] focus:ring-[#ff6600]/20"
                              />
                            ) : (
                              <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                                <span className="text-gray-900">
                                  {session.user.last_name || "Not provided"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="Enter your email address"
                              className="h-11 border-gray-300 focus:border-[#ff6600] focus:ring-[#ff6600]/20"
                            />
                          ) : (
                            <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                              <span className="text-gray-900">{session.user.email}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg text-gray-900">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <Shield className="h-4 w-4 text-purple-600" />
                          </div>
                          Account Information
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Your account details and system information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">User ID</Label>
                            <div className="h-11 px-3 bg-gray-50 border border-gray-300 rounded-md flex items-center">
                              <span className="text-gray-900 font-mono text-sm">{session.user.id}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Role</Label>
                            <div className="h-11 px-3 flex items-center">
                              <Badge className="bg-[#ff6600] text-white px-3 py-1 text-sm">
                                {session.user.role ? 
                                  session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1).toLowerCase() 
                                  : "Unknown"
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-6">
                    <Card className="border border-gray-200 shadow-sm">
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-lg text-gray-900">Profile Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-[#ff6600] rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {session.user.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">{session.user.email}</p>
                          <Badge variant="outline" className="text-gray-700">
                            {session.user.role ? 
                              session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1).toLowerCase() 
                              : "Unknown"
                            }
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-10 text-left border-gray-300 hover:bg-gray-50"
                          asChild
                        >
                          <a href="/dashboard/settings">
                            <Key className="mr-3 h-4 w-4" />
                            Change Password
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-10 text-left border-gray-300 hover:bg-gray-50"
                        >
                          <Mail className="mr-3 h-4 w-4" />
                          Contact Support
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-8 mt-0">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-gray-600">Keep your account secure and up to date</p>
                </div>

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
                        initialValues={passwordInitialValues}
                        validationSchema={passwordValidationSchema}
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
