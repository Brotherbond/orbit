"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { catchError } from "@/lib/utils";
import { useCreateTargetMutation, useGetTargetsQuery, useUpdateTargetMutation } from "@/store/targets";
import { Target } from "@/types/target";
import { Form, Formik } from "formik";
import { Save } from "lucide-react";
import { useCallback, useMemo } from "react";
import * as Yup from "yup";
import { useImeVssContext } from "../ime-vss-context";

export default function ImeVssTargetPage() {
  const { imeVss } = useImeVssContext()
  const [createTarget] = useCreateTargetMutation();
  const [updateTarget] = useUpdateTargetMutation();

  // Fetch existing targets for this IME-VSS user (if any)
  const userUuid = imeVss?.uuid || "";
  const { data: targetsData, isLoading: isTargetLoading } = useGetTargetsQuery(userUuid ? { user_id: userUuid } as any : (undefined as any), { skip: !userUuid });
  // Normalize list from different possible shapes
  const targetList: any[] = Array.isArray(targetsData) ? targetsData : (targetsData as any)?.data?.items || [];
  const existingTarget: any | undefined = targetList[0];

  const targetTypeOptions = useMemo(
    () => [
      { value: "monthly_sales", label: "Monthly Sales" },
      { value: "quarterly_sales", label: "Quarterly Sales" },
      { value: "yearly_sales", label: "Yearly Sales" },
      { value: "monthly_orders", label: "Monthly Orders" },
      { value: "quarterly_orders", label: "Quarterly Orders" },
      { value: "yearly_orders", label: "Yearly Orders" },
    ],
    []
  );

  const goalTypeOptions = useMemo(
    () => [
      { value: "amount", label: "Amount" },
      { value: "volume", label: "Volume" },
    ],
    []
  );

  const validationSchema = useMemo(() => Yup.object({
    type: Yup.string().required("Target type is required"),
    goal_type: Yup.string().oneOf(["amount", "volume"]).required("Goal type is required"),
    amount: Yup.number().when("goal_type", {
      is: "amount",
      then: (schema) => schema.min(0, "Must be a positive number").required("Amount is required"),
      otherwise: (schema) => schema.optional(),
    }),
    volume: Yup.number().when("goal_type", {
      is: "volume",
      then: (schema) => schema.min(0, "Must be a positive number").required("Volume is required"),
      otherwise: (schema) => schema.optional(),
    }),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required").min(Yup.ref('start_date'), "End date must be after start date"),
  }), [])

  const handleSubmit = useCallback(
    async (
      values: Omit<Target, "id" | "uuid" | "created_at" | "updated_at">,
      helpers: { setSubmitting: (isSubmitting: boolean) => void; setFieldError: (field: string, message: string) => void; resetForm: () => void }
    ) => {
      const { setSubmitting, setFieldError, resetForm } = helpers;
      if (!imeVss?.uuid) {
        setFieldError("type", "IME-VSS information not available");
        setSubmitting(false);
        return;
      }
      try {
        if (existingTarget?.uuid) {
          await updateTarget({ id: existingTarget.uuid, data: { ...values, user_id: imeVss.uuid } }).unwrap();
          toast({ title: "Success", description: "Target updated successfully" });
        } else {
          await createTarget({ ...values, user_id: imeVss.uuid }).unwrap();
          toast({ title: "Success", description: "Target created successfully" });
        }
        resetForm();
      } catch (error: any) {
        catchError(error, setFieldError);
      } finally {
        setSubmitting(false);
      }
    },
    [imeVss?.uuid, toast, createTarget, updateTarget, existingTarget?.uuid]
  );

  const normalizeDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const getInitialValues = useCallback((): Omit<Target, 'id' | 'uuid' | 'created_at' | 'updated_at'> => {
    if (existingTarget) {
      return {
        user_id: existingTarget.user_id || imeVss?.uuid || '0',
        type: existingTarget.type || "yearly_sales",
        goal_type: existingTarget.goal_type || "amount",
        amount: Number(existingTarget.amount || 0),
        volume: Number(existingTarget.volume || 0),
        start_date: normalizeDate(existingTarget.start_date),
        end_date: normalizeDate(existingTarget.end_date),
      }
    }
    return {
      user_id: imeVss?.uuid || '0',
      type: "yearly_sales",
      goal_type: "amount",
      amount: 0,
      volume: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    }
  }, [existingTarget, imeVss?.uuid])

  if (!imeVss) { return null; }

  const isEditMode = !!existingTarget?.uuid;

  return (
    <Card className="p-4">
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
                        {targetTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && touched.type && (
                      <p className="text-sm text-red-500">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal_type">Goal Type</Label>
                    <Select
                      value={values.goal_type}
                      onValueChange={(value) => setFieldValue("goal_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {goalTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.goal_type && touched.goal_type && (
                      <p className="text-sm text-red-500">{errors.goal_type}</p>
                    )}
                  </div>

                  {values.goal_type === "amount" && (
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
                  )}

                  {values.goal_type === "volume" && (
                    <div className="space-y-2">
                      <Label htmlFor="volume">Target Volume</Label>
                      <Input
                        id="volume"
                        name="volume"
                        type="number"
                        value={values.volume}
                        onChange={handleChange}
                        placeholder="Enter target volume"
                      />
                      {errors.volume && touched.volume && (
                        <p className="text-sm text-red-500">{errors.volume}</p>
                      )}
                    </div>
                  )}
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

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Target" : "Create Target")}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
