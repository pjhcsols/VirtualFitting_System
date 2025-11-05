import { API_BASILIUM } from "@/shared";
import type { 
  ClaimableCoupon, 
  ClaimableCouponsResponse,
  DownloadCouponRequestBody, 
  CouponInWallet,
  DownloadCouponApiResponse
} from "@/entities/coupon";

export const fetchClaimableCouponsForGuest = async (productId: number): Promise<ClaimableCoupon[] | null> => {
  try {
    const response = await API_BASILIUM.get<ClaimableCouponsResponse>(`/b1/coupons/products/${productId}/claimables`);
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const fetchMyClaimableCoupons = async (productId: number, normalUserId: string): Promise<ClaimableCoupon[] | null> => {
  try {
    const response = await API_BASILIUM.get<ClaimableCouponsResponse>(`/b1/coupons/products/${productId}/claimables`, {
      params: { normalUserId }
    });
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const downloadCoupon = async (params: { 
  brandCampaignId: number;
  authUserId: string; 
}): Promise<CouponInWallet | null> => {
  const { brandCampaignId, authUserId } = params;
  const requestBody: DownloadCouponRequestBody = { brandCampaignId };
  
  try {
    const response = await API_BASILIUM.post<DownloadCouponApiResponse>(
      `/b1/coupons/wallets`, 
      requestBody, 
      {
        params: { authUserId }
      }
    );
    
    return response.data.data;

  } catch (error) {
    return null; 
  }
};
