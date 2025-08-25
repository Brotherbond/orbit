import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@/components/ui/data-table-types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/ui/status-badge"
import { toast } from "@/hooks/use-toast"
import { AUTHORIZED_ROLES } from "@/lib/filters/orders"
import type { Order } from "@/types/order"
import { Edit, Eye, MoreHorizontal } from "lucide-react"
import React from "react"

// Types
interface ColumnProps {
  session: any
  router: any
  updateOrder: any
}



// Reusable cell components
const OrderRefCell = React.memo(({ orderRef }: { orderRef: string }) => (
  <div className="text-sm">{orderRef}</div>
))
OrderRefCell.displayName = "OrderRefCell"

const DistributorCell = React.memo(({ distributor }: { distributor: Order["distributor_user"] }) => (
  <div>
    <div className="font-medium">{distributor.distributor_details.business_name}</div>
    <div className="text-sm text-muted-foreground">{distributor.full_name}</div>
  </div>
))
DistributorCell.displayName = "DistributorCell"

const ImeVssCell = React.memo(({ imeVss }: { imeVss?: Order["ime_vss"] }) => (
  <div className="text-sm">{imeVss?.full_name || "-"}</div>
))
ImeVssCell.displayName = "ImeVssCell"

const MarketCell = React.memo(({ market }: { market: string }) => (
  <div className="text-sm">{market}</div>
))
MarketCell.displayName = "MarketCell"

const SelfPickupCell = React.memo(({ selfPickup }: { selfPickup: string }) => (
  <div className="text-sm">{selfPickup ? "Yes" : "No"}</div>
))
SelfPickupCell.displayName = "SelfPickupCell"

const PromosCell = React.memo(({ promos }: { promos?: Order["promos"] }) => (
  <div className="text-sm">{promos?.type || "None"}</div>
))
PromosCell.displayName = "PromosCell"

const ValueCell = React.memo(({ totalAmount }: { totalAmount: string }) => (
  <div className="font-medium">₦{parseFloat(totalAmount).toLocaleString()}</div>
))
ValueCell.displayName = "ValueCell"

const CreatedAtCell = React.memo(({ createdAt }: { createdAt: string }) => (
  <div className="text-sm">{createdAt}</div>
))
CreatedAtCell.displayName = "CreatedAtCell"

const StatusCell = React.memo(({ status }: { status: Order["status"] }) => (
  <StatusBadge status={status} />
))
StatusCell.displayName = "StatusCell"



// Actions cell component
const ActionsCell = React.memo(({
  row,
  session,
  router,
  actionHandlers,
  currentPath
}: {
  row: { original: Order }
  session: any
  router: any
  actionHandlers: any
  currentPath: string
}) => {
  const userRole = session?.user?.role?.toLowerCase() || ""
  const { handleConfirmPayment, handleConfirmOrder } = actionHandlers
  const order = row.original
  const canConfirmPayment = AUTHORIZED_ROLES.includes(userRole as any) && order.status === "pending"
  const showViewImeVss = !currentPath.includes('/ime-vss/')
  const showViewDistributor = !currentPath.includes('/distributors/');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/dashboard/orders/${order.uuid}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/dashboard/orders/${order.uuid}/tracks`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Track
        </DropdownMenuItem>
        {canConfirmPayment && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleConfirmPayment(order.uuid)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Confirm Payment
          </DropdownMenuItem>
        )}
        {showViewImeVss && order.ime_vss?.uuid && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/ime-vss/${order.ime_vss.uuid}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View IME-VSS
          </DropdownMenuItem>
        )}
        {showViewDistributor && order.distributor_user?.uuid && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/distributors/${order.distributor_user?.distributor_details?.uuid}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Distributor
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
ActionsCell.displayName = "ActionsCell"

export function getOrderColumns({ session, router, updateOrder, currentPath }: ColumnProps & { currentPath?: string }): ColumnDef<Order>[] {

  return [
    {
      accessorKey: "ref",
      header: "Order Ref",
      width: 125,
      cell: ({ row }) => <OrderRefCell orderRef={row.original.ref} />,
    },
    {
      accessorKey: "distributor_user.distributor_details.business_name",
      header: "Distributor",
      width: 175,
      cell: ({ row }) => <DistributorCell distributor={row.original.distributor_user} />,
    },
    {
      accessorKey: "ime_vss.full_name",
      header: "IME/VSS",
      width: 175,
      cell: ({ row }) => <ImeVssCell imeVss={row.original.ime_vss} />,
    },
    {
      accessorKey: "market",
      header: "Market",
      width: 150,
      cell: ({ row }) => <MarketCell market={row.original.market} />,
    },
    {
      accessorKey: "self_pickup",
      width: 120,
      header: "Self Pickup",
      cell: ({ row }) => <SelfPickupCell selfPickup={row.original.self_pickup} />,
    },
    {
      accessorKey: "promos",
      header: "Promos",
      width: 100,
      cell: ({ row }) => <PromosCell promos={row.original.promos} />,
    },
    {
      accessorKey: "total_amount",
      header: "Value",
      width: 150,
      cell: ({ row }) => <ValueCell totalAmount={row.original.total_amount} />,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      width: 200,
      cell: ({ row }) => <CreatedAtCell createdAt={row.original.created_at} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      width: 175,
      cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleConfirmPayment = async (orderId: string) => {
          try {
            await updateOrder({ id: orderId, data: { status: "confirmed" } }).unwrap()
            toast({
              title: "Success",
              description: "Order payment confirmed",
            })
          } catch (error: any) {
            toast({
              title: "Error",
              description: error?.message || "Failed to confirm payment",
              variant: "destructive",
            })
          }
        }

        const handleConfirmOrder = async (orderId: string) => {
          try {
            await updateOrder({ id: orderId, data: { status: "approved" } }).unwrap()
            toast({
              title: "Success",
              description: "Order Approved",
            })
          } catch (error: any) {
            toast({
              title: "Error",
              description: error?.message || "Failed to approve order",
              variant: "destructive",
            })
          }
        }

        const actionHandlers = { handleConfirmPayment, handleConfirmOrder }

        return (
          <ActionsCell
            row={row}
            session={session}
            router={router}
            actionHandlers={actionHandlers}
            currentPath={currentPath || ""}
          />
        )
      },
    },
  ]
}
