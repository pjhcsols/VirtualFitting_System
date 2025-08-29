export type DiscountQuote = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: {
    productId: number;
    brandName: string;
    baseUnitPrice: number;
    productDiscountPercent: number;
    productDiscountAmount: number;
    productDiscountedUnitPrice: number | null;
    userExtraPercent: number;
    userExtraDiscountAmount: number;
    finalUnitPrice: number;
  };
};
