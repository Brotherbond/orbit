"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, User } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface UserDetail {
  id: string
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: {
    id: string
    name: string
  }
  market: {
    id: string
    name: string
  }
  status: string
  created_at: string
  updated_at: string
  last_login: string
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.get<{ item: UserDetail }>(`/users/${params.id}`)
      setUser(data.item ?? null)
    } catch (error: any) {
      setUser(null)
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch user details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await apiClient.delete(`/users/${params.id}`)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      router.push("/dashboard/users")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">User not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#444444]">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-[#ababab]">User Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/users/${user.uuid}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-[#444444]">User Details</CardTitle>
              </div>
              <Badge
                variant={user.status === "active" ? "default" : "destructive"}
                className={`status ${user.status === "active" ? "active" : "inactive"} mt-1`}
              >
                {user.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Full Name</p>
                    <p className="font-medium text-[#444444]">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Email</p>
                    <p className="font-medium text-[#444444]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Phone</p>
                    <p className="font-medium text-[#444444]">{user.phone}</p>
                  </div>
                </div>
                <div className="hidden items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Market</p>
                    <p className="font-medium text-[#444444]">{user.market?.name || "No Market"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Role</p>
                  <Badge variant="secondary" className="mt-1">
                    {user.role?.name || "No Role"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Created</p>
                  <p className="font-medium text-[#444444]">{user.created_at}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
