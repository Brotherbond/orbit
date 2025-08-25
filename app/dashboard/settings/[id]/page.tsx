"use client";
import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { SettingProvider, useSettingContext } from "./setting-context";


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
  return (
    <SettingProvider settingId={params.id}>
      <SettingDetailPageContent params={params} />
    </SettingProvider>
  );
}

function SettingDetailPageContent({ params }: { params: { id: string } }) {
  const { setting } = useSettingContext();
  const router = useRouter();

  if (!setting) { return null; }

  return (
    <div>
      <ViewPageHeader
        title={setting.key}
        description="Setting Details"
        showEditButton={true}
        editHref={`/dashboard/settings/${params.id}/edit`}
        showDeleteButton={true}
        deleteOptions={{
          storeName: "settings",
          uuid: params.id,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Setting Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Value</p>
                <p className="font-medium text-[#444444]">{setting.value}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Description</p>
                <p className="font-medium text-[#444444]">{setting.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Status</p>
                <Badge variant={setting.status === "active" ? "default" : "secondary"}>
                  {setting.status}
                </Badge>
              </div>
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
