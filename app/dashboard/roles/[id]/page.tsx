"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleContext } from "./role-context";
import { Calendar, FileText, Laptop, Shield, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { role } = useRoleContext()

  if (!role) { return null; }

  return (
    <div>
      <ViewPageHeader
        title={role.name}
        description="Role Details"
        showEditButton={true}
        editHref={`/dashboard/roles/${role.uuid}/edit`}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "roles",
          uuid: params.id,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Role Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Description</p>
                <p className="font-medium text-[#444444]">{role.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Status</p>
                <Badge variant={role.status === "active" ? "primary" : "destructive"}>
                  {role.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[#ababab]">Access Type</span>
              <div className="flex items-center space-x-2">
                {role.access_type === "web" ? (
                  <>
                    <Laptop className="h-4 w-4 text-[#444444]" />
                    <span className="font-medium text-[#444444]">Web</span>
                  </>
                ) : role.access_type === "mobile" ? (
                  <>
                    <Smartphone className="h-4 w-4 text-[#444444]" />
                    <span className="font-medium text-[#444444]">Mobile</span>
                  </>
                ) : (
                  <span className="font-medium text-[#444444]">{role.access_type || "N/A"}</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Created</p>
                <p className="font-medium text-[#444444]">{role.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
