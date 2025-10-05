export interface ProductPrice {
  productId: number;
  baseUnitPrice: number;
  productDiscountPercent: number;
  productDiscountAmount: number;
  productDiscountedUnitPrice: number;
}

export interface DiscountQuoteData {
  productId: number;
  brandName: string;
  baseUnitPrice: number;
  productDiscountPercent: number;
  productDiscountAmount: number;
  productDiscountedUnitPrice: number | null;
  userExtraPercent: number;
  userExtraDiscountAmount: number;
  finalUnitPrice: number;
}

export interface DiscountQuoteResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: DiscountQuoteData;
}

