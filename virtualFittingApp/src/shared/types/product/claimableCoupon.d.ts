export type Coupon = {
  campaignId: number;
  scope: "BRAND" | "PRODUCT";
  percent: number;
  maxDiscountPrice: number;
  minOrderPrice: number;
  estimatedDiscountOnThisProduct: number;
  endAt: string;
  alreadyClaimed: boolean;
  remainingCanClaim: number;
  ownedCount: number;
  availableCount: number;
  usedCount: number;
  hasAvailable: boolean;
  alreadyUsedOnce: boolean;
};