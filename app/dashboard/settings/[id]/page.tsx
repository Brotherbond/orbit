"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface SettingDetail {
  id: string
  key: string
  value: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export default function SettingDetailPage({ params }: { params: { id: string } }) {
  const [setting, setSetting] = useState<SettingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchSetting()
  }, [params.id])

  const fetchSetting = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(`/settings/${params.id}`)
      if (response.data.status === "success") {
        setSetting(response.data.data.item)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch setting details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this setting?")) return

    try {
      await apiClient.delete(`/settings/${params.id}`)
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      })
      router.push("/dashboard/settings")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
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

  if (!setting) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Setting not found</p>
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
              {setting.key}
            </h1>
            <p className="text-[#ababab]">Setting Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/settings/${setting.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Setting Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-[#ababab]">Value</span>
              <div className="font-medium text-[#444444]">{setting.value}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[#ababab]">Description</span>
              <div className="font-medium text-[#444444]">{setting.description}</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[#ababab]">Status</span>
              <Badge variant={setting.status === "active" ? "default" : "secondary"}>
                {setting.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created</p>
                <p className="font-medium text-[#444444]">{setting.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
