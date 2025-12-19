// src/types/inventory.ts
export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  quantity: number;
  price: number;
  cost: number;
  category?: string | null;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}
