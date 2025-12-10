// ---------------------------------------------------------
// 1) RAW MODELS — EXACT JAVA DTO (NE PAS MODIFIER)
// ---------------------------------------------------------

export interface SaleItemRaw {
  productId: number;
  quantity: number;
  price: number; // Java SaleItemDto.price
}

export interface SaleRaw {
  id: number;
  saleDate: string;      // ISO timestamp
  totalAmount: number;
  items: SaleItemRaw[];
}

// Used for creating a new sale from the frontend
export interface CreateSaleRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}



// ---------------------------------------------------------
// 2) ENRICHED MODELS — FRONTEND ONLY (APRES JOIN AVEC PRODUCTS)
// ---------------------------------------------------------

export interface SaleItemEnriched extends SaleItemRaw {
  productName: string;
  sku: string;
  unitPrice: number;  // alias de price
  subtotal: number;   // quantity * price
}

export interface SaleEnriched {
  id: number;
  saleDate: string;
  totalAmount: number;
  items: SaleItemEnriched[];
}
