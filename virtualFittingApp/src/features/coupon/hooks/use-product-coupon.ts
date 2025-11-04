import { useQuery } from '@tanstack/react-query'; 
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import type { ClaimableCoupon } from '@/entities/coupon';
import { 
  fetchClaimableCouponsForGuest, 
  fetchMyClaimableCoupons,
  downloadCoupon 
} from '@/entities/coupon';
import { couponKeys } from '@/entities/coupon';
import { fetchMyUserDetails } from '@/entities/user';

export const useProductCoupon = (productId: number) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);
  
  const accessToken = cookies['access-token']; 

  const queryFn = async (): Promise<ClaimableCoupon[]> => {
    const guestCoupons = await fetchClaimableCouponsForGuest(productId);
    if (!guestCoupons) return [];

    if (isLoggedIn && accessToken) {
      const userDetailResponse = await fetchMyUserDetails();
      const normalUserId = userDetailResponse?.data?.id; 
      
      if (!normalUserId) {
        console.warn("사용자 ID를 가져올 수 없어 게스트 쿠폰 정보만 반환합니다.");
        return guestCoupons; 
      }
      const myCoupons = await fetchMyClaimableCoupons(productId, normalUserId);
      const myCouponsMap = new Map(myCoupons?.map(c => [c.campaignId, c]));
      const mergedCoupons = guestCoupons.map(guestCoupon => 
        myCouponsMap.get(guestCoupon.campaignId) || guestCoupon
      );
      return mergedCoupons;
    }
    return guestCoupons;
  };

  const isCouponQueryEnabled = productId > 0;
  
  const { data: coupons = [], isLoading, refetch, error } = useQuery({
    queryKey: couponKeys.claimables(productId, accessToken), 
    queryFn,
    enabled: isCouponQueryEnabled, 
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
        console.error("Failed to fetch claimable coupons (Query Error):", error);
    }
  }, [error]);

  const handleDownloadCoupon = async (brandCampaignId: number): Promise<number | null> => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return null;
    }
    try {
      const result = await downloadCoupon({ brandCampaignId, authUserId: accessToken }); 
      
      if (result && result.normalCouponWalletId) {
        
        await refetch(); 

        return result.normalCouponWalletId;
      }
      return null; 
    } catch (error) {
      console.error("쿠폰 다운로드에 실패하였습니다.", error);
      return null; 
    }
  };

  return {
    coupons,
    isLoading,
    handleDownloadCoupon,
  };
};