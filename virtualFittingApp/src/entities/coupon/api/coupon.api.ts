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
    console.log(`[게스트용 쿠폰 조회 (상품 ID: ${productId})] API 응답 성공:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`[게스트용 쿠폰 조회 (상품 ID: ${productId})] API 요청 실패:`, error);
    return null;
  }
};

export const fetchMyClaimableCoupons = async (productId: number, normalUserId: string): Promise<ClaimableCoupon[] | null> => {
  try {
    const response = await API_BASILIUM.get<ClaimableCouponsResponse>(`/b1/coupons/products/${productId}/claimables`, {
      params: { normalUserId }
    });
    console.log(`[사용자 쿠폰 조회 (상품 ID: ${productId})] API 응답 성공:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`[사용자 쿠폰 조회 (상품 ID: ${productId})] API 요청 실패:`, error);
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
    
    console.log(`[쿠폰 다운로드 (ID: ${brandCampaignId})] API 응답 성공:`, response.data);
    return response.data.data;

  } catch (error) {
    console.error(`[쿠폰 다운로드 (ID: ${brandCampaignId})] API 호출 실패:`, error);
    return null; 
  }
};
