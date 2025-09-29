import { apiClient } from "@/shared/api/apiClient";
import type { 
  DownloadCouponRequestBody, 
  CouponInWallet,
  ClaimableCoupon,
  DownloadCouponApiResponse,
  ClaimableCouponsResponse
} from "@/entities/coupon";

export const downloadCoupon = async (params: { 
  campaignId: number; 
  authUserId: string; 
}): Promise<CouponInWallet | null> => {
  const { campaignId, authUserId } = params;
  const requestBody: DownloadCouponRequestBody = { campaignId };
  
  const response = await apiClient<DownloadCouponApiResponse>({
    method: 'post',
    url: `/b1/coupons/wallets`,
    data: requestBody,
    params: { authUserId }
  }, `쿠폰 다운로드 (ID: ${campaignId})`);

  return response ? response.data : null;
};

export const fetchClaimableCoupons = async (productId: number, normalUserId?: string): Promise<ClaimableCoupon[] | null> => {
  const response = await apiClient<ClaimableCouponsResponse>({
    method: 'get',
    url: `/b1/coupons/products/${productId}/claimables`,
    params: normalUserId ? { normalUserId } : {}
  }, `발급 가능 쿠폰 조회 (상품 ID: ${productId})`);

  return response ? response.data : null;
};

