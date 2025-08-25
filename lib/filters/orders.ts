import { FilterConfig } from "@/components/ui/data-table";

export const ORDER_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Update Requested", value: "update_requested" },
  { label: "Rejected", value: "rejected" },
  { label: "Delivered", value: "delivered" },
  { label: "Fulfilled", value: "fulfilled" },
];

export const AUTHORIZED_ROLES = ["sales-admin", "super-admin", "treasury"];

const BASE_ORDER_FILTERS: FilterConfig[] = [
  {
    type: "select",
    label: "Status",
    param: "status",
    options: ORDER_STATUS_OPTIONS,
  },
  {
    type: "selectWithFetch",
    label: "Distributor",
    param: "distributor",
    fetchUrl: "/distributors",
    valueKey: "user.uuid",
    labelKey: "business_name",
    searchParam: "search",
    placeholder: "Select distributor...",
    labelFormatter: (item: any) => item.business_name,
  },
  {
    type: "selectWithFetch",
    label: "Market",
    param: "market",
    fetchUrl: "/markets",
    valueKey: "uuid",
    labelKey: "full_name",
    searchParam: "search",
    placeholder: "Select market...",
    labelFormatter: (item: any) => item.full_name,
  },
];

export const ORDER_FILTERS = BASE_ORDER_FILTERS;
export const DISTRIBUTOR_ORDER_FILTERS = (() => {
  const filters = [...BASE_ORDER_FILTERS];
  filters.splice(1, 1);
  return filters;
})();
