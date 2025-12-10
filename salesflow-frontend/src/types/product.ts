export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  lowStockThreshold: number;
}
