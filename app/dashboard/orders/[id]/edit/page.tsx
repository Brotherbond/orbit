"use client"


import ViewPageHeader from "@/components/dashboard/ViewPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { catchError } from "@/lib/utils";
import { useUpdateOrderMutation } from "@/store/orders";
import { ErrorMessage, Form, Formik } from "formik";
import { Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { useOrderContext } from "../order-context";

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
  const [updateOrder] = useUpdateOrderMutation()

  if (!order) { return null; }

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
      if (session?.user?.role === "sales-admin" && values?.content) {
        await handleMessageSubmit(values?.content || "");
      }
      const payload = { status: values?.status }
      await updateOrder({ id: params.id, data: payload as any }).unwrap()
      fetchOrder(); // Refetch the order data
      router.push(`/dashboard/orders/${params.id}`)
    } catch (error: any) {
      catchError(error, setFieldError);
    } finally {
      setSubmitting(false);
    }
  }

  // Message submit logic removed for now (mutation hook not implemented)
  const handleMessageSubmit = async (_content: string) => { };

  return (
    <div>
      <ViewPageHeader
        title={session?.user?.role === "treasury" ? "Confirm Payment" : "Update Order"}
        description={session?.user?.role === "treasury" ? "Confirm payment for this order" : "Update order information"}
      />
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
