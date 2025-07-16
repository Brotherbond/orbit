export interface BrandPackage {
  uuid?: string;
  type: string;
  quantity: number;
  og_price: number;
  wholesale_price: number;
  retail_price: number;
  retail_price_with_markup: number;
  distributor_price: number;
}

export interface Brand {
  uuid: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  packages: BrandPackage[];
  created_at: string;
  updated_at: string;
}
