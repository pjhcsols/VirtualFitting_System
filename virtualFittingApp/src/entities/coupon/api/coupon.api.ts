import { apiClient } from "@/shared/api/apiClient";
import type { 
  ClaimableCoupon, 
  DownloadCouponRequestBody, 
  DownloadCouponResponseData 
} from "../model/types";

export const fetchClaimableCoupons = (productId: number, normalUserId?: string): Promise<ClaimableCoupon[] | null> => {
  return apiClient<ClaimableCoupon[]>({
    method: 'get',
    url: `/b1/coupons/products/${productId}/claimables`,
    params: normalUserId ? { normalUserId } : {}
  }, "발급 가능 쿠폰 조회");
};

export const downloadCoupon = (params: { campaignId: number; authUserId: string; }): Promise<DownloadCouponResponseData | null> => {
  const { campaignId, authUserId } = params;
  const requestBody: DownloadCouponRequestBody = { campaignId };
  
  return apiClient<DownloadCouponResponseData>({
    method: 'post',
    url: `/b1/coupons/wallets`,
    data: requestBody,
    params: { authUserId }
  }, "쿠폰 다운로드");
};
