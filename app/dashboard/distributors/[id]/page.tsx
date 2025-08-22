"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, CreditCard, Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import {
  useDistributor,
  useDistributorInfo,
  useDistributorPerformance,
  useDistributorUser
} from "./distributor-context";

const BusinessAndContactInformationCard = memo(() => {
  const distributorInfo = useDistributorInfo()
  const user = useDistributorUser()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-[#444444]">Distributor Details</CardTitle>
        </div>
        {user && (
          <Badge
            variant={user.status === "active" ? "default" : "destructive"}
            className={`status ${user.status === "active" ? "active" : "inactive"} mt-1`}
          >
            {user.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Building className="h-5 w-5 text-[#ababab]" />
            <div>
              <p className="text-sm text-[#ababab]">Business Name</p>
              <p className="font-medium text-[#444444]">{distributorInfo.business_name}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#ababab]">Contact Person</p>
            <p className="font-medium text-[#444444]">
              {user?.first_name} {user?.last_name}
            </p>
          </div>
          <div className="hidden items-center space-x-0">
            <Badge variant="secondary">{distributorInfo.business_type}</Badge>
          </div>
          <RegistrationInfo />
        </div>
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 md:col-span-2">
            <MapPin className="h-5 w-5 text-[#ababab] mt-1" />
            <div>
              <p className="text-sm text-[#ababab]">Address</p>
              <p className="font-medium text-[#444444]">{distributorInfo.address}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
})
BusinessAndContactInformationCard.displayName = 'BusinessAndContactInformationCard'

const RegistrationInfo = memo(() => {
  const { distributor } = useDistributor()

  if (!distributor?.registration_number && !distributor?.tax_id) return null

  return (
    <>
      {distributor.registration_number && (
        <div>
          <p className="text-sm text-[#ababab]">Registration Number</p>
          <p className="font-medium text-[#444444]">{distributor.registration_number}</p>
        </div>
      )}
      {distributor.tax_id && (
        <div>
          <p className="text-sm text-[#ababab]">Tax ID</p>
          <p className="font-medium text-[#444444]">{distributor.tax_id}</p>
        </div>
      )}
    </>
  )
})
RegistrationInfo.displayName = 'RegistrationInfo'

const BankingInformationCard = memo(() => {
  const { distributor } = useDistributor()

  if (!distributor?.bank_name && !distributor?.account_number) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#444444]">Banking Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {distributor.bank_name && (
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-[#ababab]" />
              <div>
                <p className="text-sm text-[#ababab]">Bank Name</p>
                <p className="font-medium text-[#444444]">{distributor.bank_name}</p>
              </div>
            </div>
          )}
          {distributor.account_number && (
            <div>
              <p className="text-sm text-[#ababab]">Account Number</p>
              <p className="font-medium text-[#444444]">{distributor.account_number}</p>
            </div>
          )}
          {distributor.account_name && (
            <div>
              <p className="text-sm text-[#ababab]">Account Name</p>
              <p className="font-medium text-[#444444]">{distributor.account_name}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
BankingInformationCard.displayName = 'BankingInformationCard'

const PerformanceMetricsCard = memo(() => {
  const performance = useDistributorPerformance()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#444444]">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[#ababab]">Total Orders</span>
          <span className="font-bold text-[#444444]">{performance?.total_orders || 0}</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-[#ababab]">Total Value</span>
          <span className="font-bold text-[#444444]">
            ₦{(performance?.total_order_value || 0).toLocaleString()}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-[#ababab]">Target Volume</span>
          <span className="font-bold text-[#444444]">
            {(performance?.target_volume || 0).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})
PerformanceMetricsCard.displayName = 'PerformanceMetricsCard'

export default function DistributorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { distributor } = useDistributor()

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BusinessAndContactInformationCard />
          <BankingInformationCard />
        </div>

        <div>
          <PerformanceMetricsCard />
        </div>
      </div>
    </div>
  )
}
