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

interface ImeVssDetail {
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

export default function ImeVssDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [imeVss, setImeVss] = useState<ImeVssDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params
      fetchImeVss(resolvedParams.id)
    }
    fetchData()
  }, [params])

  const fetchImeVss = async (id: string) => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.get<{ item: ImeVssDetail }>(`/users/${id}`)
      setImeVss(data.item ?? null)
    } catch (error: any) {
      setImeVss(null)
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch IME-VSS user details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this IME-VSS user?")) return

    try {
      const resolvedParams = await params
      await apiClient.delete(`/users/${resolvedParams.id}`)
      toast({
        title: "Success",
        description: "IME-VSS user deleted successfully",
      })
      router.push("/dashboard/ime-vss")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete IME-VSS user",
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

  if (!imeVss) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">IME-VSS user not found</p>
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
              {imeVss.first_name} {imeVss.last_name}
            </h1>
            <p className="text-[#ababab]">IME-VSS User Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/ime-vss/${imeVss.uuid}/edit`)}>
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
                <CardTitle className="text-[#444444]">IME-VSS User Details</CardTitle>
              </div>
              <Badge
                variant={imeVss.status === "active" ? "default" : "destructive"}
                className={`status ${imeVss.status === "active" ? "active" : "inactive"} mt-1`}
              >
                {imeVss.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Full Name</p>
                    <p className="font-medium text-[#444444]">
                      {imeVss.first_name} {imeVss.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Email</p>
                    <p className="font-medium text-[#444444]">{imeVss.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Phone</p>
                    <p className="font-medium text-[#444444]">{imeVss.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Market</p>
                    <p className="font-medium text-[#444444]">{imeVss.market?.name || "No Market"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Role</p>
                  <Badge variant="secondary" className="mt-1">
                    {imeVss.role?.name || "No Role"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-[#ababab]">Created</p>
                  <p className="font-medium text-[#444444]">{imeVss.created_at}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
