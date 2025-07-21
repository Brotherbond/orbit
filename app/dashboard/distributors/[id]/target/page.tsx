"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@/components/ui/data-table-types"
import {
    Calendar, Save,
    X,
    Plus,
    Trash2,
    MoreHorizontal
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useDistributor, useDistributorUser } from "../distributor-context"
import { Target } from "@/types/target"


export default function DistributorTargetPage() {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const distributorId = params?.id as string
  const dataTableRef = useRef<{ refresh: () => void }>(null)
  const { distributor, isLoading: isDistributorLoading, error } = useDistributor()
  const distributorUser = useDistributorUser()

  const refreshTable = useCallback(() => {
    dataTableRef.current?.refresh()
  }, [])

  // Memoize validation schema to prevent recreation on every render
  const validationSchema = useMemo(() => Yup.object({
    type: Yup.string().required("Target type is required"),
    amount: Yup.number().min(0, "Must be a positive number").required("Amount is required"),
    volume: Yup.number().min(0, "Must be a positive number"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required").min(Yup.ref('start_date'), "End date must be after start date"),
  }), [])

  const handleSubmit = useCallback(async (values: Omit<Target, 'id' | 'uuid' | 'created_at' | 'updated_at'>) => {
    if (!distributorUser?.uuid) {
      toast({
        title: "Error",
        description: "Distributor information not available",
        variant: "destructive",
      })
      return
    }

    try {
      const payload = {
        ...values,
        user_id: distributorUser.uuid
      }
      
      await apiClient.post(`/targets`, payload)
      toast({
        title: "Success",
        description: "Target created successfully",
      })
      setIsEditing(false)
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save target",
        variant: "destructive",
      })
    }
  }, [distributorUser?.uuid, toast, refreshTable])

  // Memoize initial values to prevent recreation on every render
  const getInitialValues = useCallback((): Omit<Target, 'id' | 'uuid' | 'created_at' | 'updated_at'> => {
    return {
      user_id: 0,
      type: "monthly_sales",
      amount: 0,
      volume: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    }
  }, [])

  // Memoize utility functions
  const getTargetTypeLabel = useCallback((type: string) => {
    const types: Record<string, string> = {
      monthly_sales: "Monthly Sales",
      quarterly_sales: "Quarterly Sales",
      yearly_sales: "Yearly Sales",
      monthly_orders: "Monthly Orders",
      quarterly_orders: "Quarterly Orders",
      yearly_orders: "Yearly Orders",
    }
    return types[type] || type
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return `₦${amount.toLocaleString()}`
  }, [])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }, [])

  const handleDeleteTarget = useCallback(async (targetId: string) => {
    if (!confirm("Are you sure you want to delete this target?")) return

    try {
      await apiClient.delete(`/targets/${targetId}`)
      toast({
        title: "Success",
        description: "Target deleted successfully",
      })
      refreshTable()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete target",
        variant: "destructive",
      })
    }
  }, [toast, refreshTable])

  const columns = useMemo(
    () => getColumns(toast, handleDeleteTarget, getTargetTypeLabel, formatCurrency, formatDate),
    [toast, handleDeleteTarget, getTargetTypeLabel, formatCurrency, formatDate]
  )

  if (isDistributorLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !distributor) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ababab]">{error || "Distributor not found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button className="btn-primary" onClick={() => setIsEditing(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Target
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#444444]">Add New Target</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={getInitialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, handleChange, setFieldValue, errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Target Type</Label>
                        <Select
                          value={values.type}
                          onValueChange={(value) => setFieldValue("type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly_sales">Monthly Sales</SelectItem>
                            <SelectItem value="quarterly_sales">Quarterly Sales</SelectItem>
                            <SelectItem value="yearly_sales">Yearly Sales</SelectItem>
                            <SelectItem value="monthly_orders">Monthly Orders</SelectItem>
                            <SelectItem value="quarterly_orders">Quarterly Orders</SelectItem>
                            <SelectItem value="yearly_orders">Yearly Orders</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && touched.type && (
                          <p className="text-sm text-red-500">{errors.type}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Target Amount (₦)</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={values.amount}
                          onChange={handleChange}
                          placeholder="Enter target amount"
                        />
                        {errors.amount && touched.amount && (
                          <p className="text-sm text-red-500">{errors.amount}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume">Target Volume (Optional)</Label>
                        <Input
                          id="volume"
                          name="volume"
                          type="number"
                          value={values.volume || ""}
                          onChange={handleChange}
                          placeholder="Enter target volume"
                        />
                        {errors.volume && touched.volume && (
                          <p className="text-sm text-red-500">{errors.volume}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          name="start_date"
                          type="date"
                          value={values.start_date}
                          onChange={handleChange}
                        />
                        {errors.start_date && touched.start_date && (
                          <p className="text-sm text-red-500">{errors.start_date}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          name="end_date"
                          type="date"
                          value={values.end_date}
                          onChange={handleChange}
                        />
                        {errors.end_date && touched.end_date && (
                          <p className="text-sm text-red-500">{errors.end_date}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-[#eeeeee]">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="btn-primary">
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Target"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          ref={dataTableRef}
          columns={columns as unknown as ColumnDef<unknown, unknown>[]}
          searchKey="type"
          searchPlaceholder="Search targets..."
          store="distributorTargets"
          fixedQuery={{ user_id: distributorUser?.uuid }}
          exportFileName="Distributor-Targets.xlsx"
        />
      )}
    </div>
  )
}

function getColumns(
  toast: any,
  handleDeleteTarget: (uuid: string) => void,
  getTargetTypeLabel: (type: string) => string,
  formatCurrency: (amount: number) => string,
  formatDate: (date: string) => string
): ColumnDef<Target>[] {
  return [
    {
      accessorKey: "type",
      header: "Target Type",
      cell: ({ row }) => (
        <div className="font-medium">{getTargetTypeLabel(row.original.type)}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-semibold text-[#444444]">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.volume ? row.original.volume.toLocaleString() : "-"}
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Period",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-[#ababab]" />
          <span className="text-sm">
            {formatDate(row.original.start_date!)} - {formatDate(row.original.end_date!)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="secondary">Active</Badge>,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.created_at ? formatDate(row.original.created_at) : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleDeleteTarget(row.original.uuid!)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Target
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
