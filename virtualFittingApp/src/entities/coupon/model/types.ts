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
  ownedCount: number;
  usedCount: number;
  availableCount: number;
  hasAvailable: boolean;
  remainingCanClaim: number;
  normalCouponIds: number[];
  usedNormalCouponIds: number[];
  expiredNormalCouponIds: number[];
  walletId?: number;
}

export type ClaimableCouponsResponse = ApiResponse<ClaimableCoupon[]>;

export interface DownloadCouponRequestBody {
  brandCampaignId: number; 
}

export interface CouponInWallet {
  normalCouponWalletId: number;
  brandCampaignId: number;
  percent: number;
  maxDiscountPrice: number;
}

export type DownloadCouponApiResponse = ApiResponse<CouponInWallet>;
