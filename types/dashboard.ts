interface BrandCategoryPriceData {
  category: string;
  total_price: string;
  volume: number;
}

interface DailyRevenue {
  date: string;
  total: string;
}

export interface DashboardData {
  daily_revenue: DailyRevenue[];
  total_revenue: string;
  total_order_volume: number;
  total_volume: number;
  brand_category_price_data: BrandCategoryPriceData[];
}

export interface DailyRevenueWithDay extends DailyRevenue {
  dayOfWeek: string;
  formattedDate: string;
}
