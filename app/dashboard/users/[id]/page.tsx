"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserContext } from "./user-context";
import { Calendar, Mail, MapPin, Phone, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useUserContext()

  if (!user) { return null; }

  return (
    <div>
      <ViewPageHeader
        title={`${user.first_name} ${user.last_name}`}
        description="User Details"
        showEditButton={true}
        editHref={`/dashboard/users/${user.uuid}/edit`}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "users",
          uuid: params.id,
        }}
      />

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
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Role</p>
                    <Badge variant="secondary" className="mt-1">
                      {user.role?.name || "No Role"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#ababab]" />
                  <div>
                    <p className="text-sm text-[#ababab]">Created</p>
                    <p className="font-medium text-[#444444]">{user.created_at}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
