"use client"


import { useOrderContext } from "../order-context"
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
  const { order, isLoading, fetchOrder } = useOrderContext();
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const validationSchema = Yup.object({
    status: Yup.string().oneOf([
      "approved",
      "confirmed",
      "delivered",
      "fulfilled",
      "pending",
      "rejected",
      "update_requested",
    ]).required(),
    content: Yup.string().optional(),
  })

  const handleSubmit = async (values: OrderData, { setSubmitting, setFieldError }: any) => {
    try {
      session?.user?.role === "sales-admin" && values?.content && handleMessageSubmit(values?.content || "");
      const payload = { status: values?.status }
      const response = await apiClient.put<any>(`/orders/${params.id}`, payload)
      if (response.status === "success") {
        toast({ title: "Success", description: "Order updated successfully" });
        fetchOrder(); // Refetch the order data
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
      setSubmitting(false)
    }
  }

  const handleMessageSubmit = async (content: string) => {
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
            initialValues={order as OrderData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label>Distributor</Label>
                  <Input
                    defaultValue={values?.distributor_user?.full_name || ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  <Input
                    defaultValue={values?.total_amount}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values?.status}
                    onValueChange={(value) => setFieldValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const allOptions = [
                          { value: "approved", label: "Approved" },
                          { value: "confirmed", label: "Confirmed" },
                          { value: "delivered", label: "Delivered" },
                          { value: "fulfilled", label: "Fulfilled" },
                          { value: "pending", label: "Pending" },
                          { value: "rejected", label: "Rejected" },
                          { value: "update_requested", label: "Update Requested" },
                        ];
                        let filteredOptions = allOptions;
                        if (session?.user?.role === "sales-admin") {
                          filteredOptions = allOptions.filter(opt =>
                            ["approved", "update_requested", "confirmed"].includes(opt.value)
                          );
                        } else if (session?.user?.role === "treasury") {
                          filteredOptions = allOptions.filter(opt =>
                            ["update_requested", "confirmed", "pending"].includes(opt.value)
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
                    value={values?.content}
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
