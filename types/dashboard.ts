interface BrandCategoryPriceData {
  category: string;
  total_price: string;
  volume: number;
}

interface Revenue {
  date: string;
  total: number;
}

export interface DashboardData {
  total_revenue: string;
  revenue?: {
    labels: string[];
    data: number[];
    period_type: string;
  };
  total_order_volume: number;
  total_volume: number;
  brand_category_price_data: BrandCategoryPriceData[];
}

export interface RevenueWithDay extends Revenue {
  dayOfWeek: string;
  formattedDate: string;
}
