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
} from '../api/coupon.api';
import { couponKeys } from '../coupon.keys';

export const useProductCoupon = (productId: number) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);
  
  const accessToken = cookies['access-token']; 

  const queryFn = async (): Promise<ClaimableCoupon[]> => {
    const guestCoupons = await fetchClaimableCouponsForGuest(productId);
    if (!guestCoupons) return [];

    if (isLoggedIn && accessToken) {
      const myCoupons = await fetchMyClaimableCoupons(productId, accessToken);
      const myCouponsMap = new Map(myCoupons?.map(c => [c.campaignId, c]));
      const mergedCoupons = guestCoupons.map(guestCoupon => 
        myCouponsMap.get(guestCoupon.campaignId) || guestCoupon
      );
      return mergedCoupons;
    }
    return guestCoupons;
  };

  const { data: coupons = [], isLoading, refetch, error } = useQuery({
    queryKey: couponKeys.claimables(productId, accessToken), 
    queryFn,
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
        console.error("Failed to fetch claimable coupons (Query Error):", error);
    }
  }, [error]);

  const handleDownloadCoupon = async (campaignId: number): Promise<boolean> => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return false;
    }
    try {
      const result = await downloadCoupon({ campaignId, authUserId: accessToken });
      if (result) {

        await refetch(); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("쿠폰 다운로드에 실패하였습니다.", error);
      return false;
    }
  };

  return {
    coupons,
    isLoading,
    handleDownloadCoupon,
  };
};
