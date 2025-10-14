import type { ApiResponse } from "@/shared/types/api";

export interface CouponBase {
  campaignId: number;
  percent: number;
  maxDiscountPrice: number;
}

export interface ClaimableCoupon extends CouponBase {
  scope: "BRAND" | "PRODUCT";
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
}

export type ClaimableCouponsResponse = ApiResponse<ClaimableCoupon[]>;

export interface DownloadCouponRequestBody {
  campaignId: number;
}

export interface CouponInWallet extends CouponBase {
  walletId: number;
}

export type DownloadCouponApiResponse = ApiResponse<CouponInWallet>;

