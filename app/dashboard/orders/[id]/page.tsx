"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import SuccessIcon from "@/images/success.svg";
import Modal from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/order";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch order details
  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response  = await apiClient.get<{ item: Order }>(`/orders/${params.id}`);
      setOrder(response.data.item ?? null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Fetch messages for the order
  const fetchMessages = async () => {
    setIsMessagesLoading(true);
    try {
      const response = await apiClient.get<{ items: any[] }>(`/orders/${params.id}/messages`);
      setMessages(response.data.items ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const updateOrderStatus = async (status: string, extra: Record<string, any> = {}) => {
    setIsSubmitting(true);
    try {
      await apiClient.put<{ status: string }>(`/orders/${params.id}`, { status, ...extra });
      toast({
        title: "Success",
        description: `Order ${status.replace("_", " ")} successfully`,
      });
      fetchOrder();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || `Failed to update order status to ${status}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestUpdate = () => {
    setIsModalOpen(true);
    setUpdateMessage("");
  };

  const handleSubmitUpdate = async () => {
    if (!updateMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        content: updateMessage,
        sales_admin: user?.uuid,
      };
      await apiClient.post<{ status: string }>(`/orders/${params.id}/messages`, payload);
      await updateOrderStatus("update_requested", { sales_admin: user?.uuid });
      toast({
        title: "Success",
        description: "Update request sent successfully",
      });
      setIsModalOpen(false);
      setUpdateMessage("");
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to send update request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = () => updateOrderStatus("confirmed");
  const handleApproveOrder = () => updateOrderStatus("approved");


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

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">Order not found</p>
      </div>
    )
  }

  const userRole = user?.role?.toLowerCase() || ""

  const orderStatus = order.status?.toLowerCase() || "pending"

  function FooterButtons({
    userRole,
    orderStatus,
    isSubmitting,
    handleRequestUpdate,
    handleConfirmPayment,
    handleApproveOrder,
  }: {
    userRole: string;
    orderStatus: string;
    isSubmitting: boolean;
    handleRequestUpdate: () => void;
    handleConfirmPayment: () => void;
    handleApproveOrder: () => void;
  }) {
    if (userRole === "treasury") {
      if (orderStatus === "pending") {
        return (
          <>
            <Button variant="outline" className="btn-secondary ml-2" onClick={handleRequestUpdate} disabled={isSubmitting}>
              Request update
            </Button>
            <Button className="btn-primary ml-2" onClick={handleConfirmPayment} disabled={isSubmitting}>
              Confirm Payment
            </Button>
          </>
        )
      }
      if (orderStatus === "update_requested") {
        return (
          <Badge className="text-[#FF6600] bg-[#FF660012] border-none p-3 rounded-[10px]">Awaiting update</Badge>
        )
      }
      return (
        <Badge className="text-[#12B636] bg-[#1CD34412] border-none p-3 rounded-[10px]">Payment Confirmed <Image src={SuccessIcon} alt="Success" width={16} height={16} className="inline mx-2" /></Badge>
      )
    }
    if (userRole === "sales-admin") {
      if (orderStatus === "confirmed") {
        return (
          <>
            <Button className="btn-secondary" onClick={handleRequestUpdate} disabled={isSubmitting}>
              Request update
            </Button>
            <Button className="btn-primary ml-2" onClick={handleApproveOrder} disabled={isSubmitting}>
              Approve Order
            </Button>
          </>
        )
      }
      if (orderStatus === "update_requested") {
        return (
          <Badge className="text-[#FF6600] bg-[#FF660012] border-none p-3 rounded-[10px]">Awaiting update</Badge>
        )
      }
      return (
        <>
          <Button variant="outline">Generate Receipt</Button>
          <Badge className="text-[#12B636] bg-[#1CD34412] border-none ml-2 p-3 rounded-[10px]">Order Approved <Image src={SuccessIcon} alt="Success" width={16} height={16} className="inline mx-2" /></Badge>
        </>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-[#444444]">
              Order Details
            </h1>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="mb-6 text-[#FF6600] font-bold text-lg">
            #{order.ref}
          </div>
          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Order Date</p>
              <p className="font-sm text-sm text-[#666666]">
                {order.created_at ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Field Agent [IME]</p>
              <p className="font-sm text-sm text-[#666666]">
                {order.ime_vss?.full_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Distributor</p>
              <p className="font-sm text-sm text-[#666666]">
                {order.distributor_user?.distributor_details?.business_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-medium font-semibold text-[#333333] mb-1">Status</p>
              <StatusBadge status={order.status || "N/A"} />
            </div>
          </div>
          {/* Products Table */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-medium font-medium text-[#333333]">Product</th>
                    <th className="text-left py-3 px-4 text-medium font-medium text-[#333333]">Quantity</th>
                    <th className="text-left py-3 px-4 text-medium font-medium text-[#333333]">Price</th>
                    <th className="text-left py-3 px-4 text-medium font-medium text-[#333333]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.brands?.map((brand: Order["brands"][number], idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100"
                      style={{ backgroundColor: idx % 2 === 0 ? "#F8F8F8" : undefined }}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-[#666666]">{brand.info.name}</p>
                          <p className="text-sm font-light text-[#666666]">{brand.info.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-light text-[#333333]">{brand.quantity}</td>
                      <td className="py-3 px-4 font-light text-[#333333]">₦{brand.price}</td>
                      <td className="py-3 px-4 font-light text-[#333333]">
                        ₦{(parseFloat(brand.price) * parseInt(brand.quantity)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 px-4 font-semibold text-[#333333]">Grand Total</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 font-semibold text-[#333333]">
                      ₦{order.total_amount ? parseFloat(order.total_amount).toLocaleString() : '0'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
        {/* Chat Section */}
        <div className="mb-8">
          {/* <h2 className="text-lg font-semibold mb-2 text-[#444]">Order Chat</h2> */}
          <div className="bg-[#f7f7f7] rounded-lg p-4 max-h-72 overflow-y-auto flex flex-col gap-2">
            {isMessagesLoading ? (
              <div className="text-gray-400 text-center">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-gray-400 text-center">No messages yet.</div>
            ) : (
              messages.map((msg, idx) => {
                const isCurrentUser = msg.sender.uuid === user?.uuid;
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow text-sm ${isCurrentUser
                        ? "bg-[#FF6600] text-white rounded-br-none"
                        : "bg-[#FFB37C1A] text-[#333] rounded-bl-none border"
                        }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                        <div className={`text-sm ${isCurrentUser ? "text-white" : "text-[#333]"} `}>
                          {isCurrentUser ? "You" : msg.sender.full_name}
                        </div>
                      </div>

                      {msg.content}
                      <div className="text-[10px] text-right mt-1 opacity-70">
                        {msg.created_at}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 m-4">
          <FooterButtons
            userRole={userRole}
            orderStatus={orderStatus}
            isSubmitting={isSubmitting}
            handleRequestUpdate={handleRequestUpdate}
            handleConfirmPayment={handleConfirmPayment}
            handleApproveOrder={handleApproveOrder}
          />
        </div>
      </Card>

      {/* Request Update Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} size="third-right" title="Request Update">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter your update request message..."
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button className="btn-primary" onClick={handleSubmitUpdate} disabled={isSubmitting || !updateMessage.trim()}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
