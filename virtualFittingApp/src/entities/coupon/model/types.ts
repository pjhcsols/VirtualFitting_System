export type ClaimableCoupon = {
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

export interface DownloadCouponRequestBody {
  campaignId: number;
}

export interface DownloadCouponResponseData {
  walletId: number;
  campaignId: number;
  percent: number;
  maxDiscountPrice: number;
}