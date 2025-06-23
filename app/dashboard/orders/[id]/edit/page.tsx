"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form, ErrorMessage } from "formik"
import * as Yup from "yup"

interface OrderData {
  uuid: string
  ime_vss: {
    uuid: string
    full_name: string
  }
  distributor_user: {
    uuid: string
    full_name: string
  }
  brands: Array<{
    uuid: string
    quantity: string
    price: string
    info: {
      uuid: string
      name: string
      category: string
    }
  }>
  total_amount: string
  status: string
  content?: string
}

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<OrderData>({
    uuid: "",
    ime_vss: { uuid: "", full_name: "" },
    distributor_user: { uuid: "", full_name: "" },
    brands: [],
    total_amount: "",
    status: "pending",
    content: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const {data} = await apiClient.get<{ item: OrderData }>(`/orders/${params.id}`)
      if (data.item) {
        setInitialValues(data.item)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order data",
        variant: "destructive",
      })
    }
  }

  const validationSchema = Yup.object({
    status: Yup.string().oneOf([
      "pending",
      "confirmed",
      "approved",
      "update_requested",
      "rejected",
      "fulfilled"
    ]).required(),
    content: Yup.string().optional(),
  })

  const handleSubmit = async (values: OrderData, { setSubmitting, setFieldError }: any) => {
    setIsLoading(true)
    try {
      session?.user?.role === "sales-admin" && values.content && handleMessageSubmit(values.content || "");
      const payload = { status: values.status }
      const response = await apiClient.put<{ status: string }>(`/orders/${params.id}`, payload)
      if (response.status === "success") {
        toast({ title: "Success", description: "Order updated successfully" })
        router.push(`/dashboard/orders/${params.id}`)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update order",
        variant: "destructive",
      })
      setFieldError("reference", error.response?.data?.errors?.reference || "")
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  const handleMessageSubmit = async (content: string) => {
    setIsLoading(true)
    try {
      const payload = { content, sales_admin: session?.user?.uuid }
      const response = await apiClient.post<{ status: string }>(`/orders/${params.id}/messages`, payload)
      if (response.status === "success") {
        toast({ title: "Success", description: "Message updated successfully" })
        fetchOrder()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#444444]">
            {session?.user?.role === "treasury" ? "Confirm Payment" : "Update Order"}
          </h1>
          <p className="text-[#ababab]">
            {session?.user?.role === "treasury" ? "Confirm payment for this order" : "Update order information"}
          </p>
        </div>
      </div>
      <Card className="max-w-2xl">
<CardHeader>
  <CardTitle>Order Information</CardTitle>
  {session?.user?.role !== "treasury" && (
    <CardDescription>Update the order status below</CardDescription>
  )}
</CardHeader>
        <CardContent>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label>Distributor</Label>
                  <Input
                    defaultValue={values.distributor_user?.full_name || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input
                    defaultValue={values.total_amount}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(value) => setFieldValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const allOptions = [
                          { value: "pending", label: "Pending" },
                          { value: "confirmed", label: "Confirmed" },
                          { value: "approved", label: "Approved" },
                          { value: "update_requested", label: "Update Requested" },
                          { value: "rejected", label: "Rejected" },
                          { value: "fulfilled", label: "Fulfilled" },
                        ];
                        let filteredOptions = allOptions;
                        if (session?.user?.role === "sales-admin") {
                          filteredOptions = allOptions.filter(opt =>
                            ["approved", "update_requested", "confirmed"].includes(opt.value)
                          );
                        } else if (session?.user?.role === "treasury") {
                          filteredOptions = allOptions.filter(opt =>
                            ["update_requested","confirmed", "pending"].includes(opt.value)
                          );
                        }
                        return filteredOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="status" component="p" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    placeholder="Enter Message"
                    rows={4}
                  />
                  <ErrorMessage name="content" component="p" className="text-sm text-red-500" />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isLoading || isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading || isSubmitting
                      ? (session?.user?.role === "treasury" ? "Confirming..." : "Updating...")
                      : (session?.user?.role === "treasury" ? "Confirm Payment" : "Update Order")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
