import { useState, useEffect, useCallback } from 'react';
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

export const useProductCoupon = (productId: number) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);

  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const guestCoupons = await fetchClaimableCouponsForGuest(productId);
      if (!guestCoupons) {
        setCoupons([]);
        return;
      }
      if (isLoggedIn) {
        const accessToken = cookies['access-token'];
        if (accessToken) {
          const myCoupons = await fetchMyClaimableCoupons(productId, accessToken);
          const myCouponsMap = new Map(myCoupons?.map(c => [c.campaignId, c]));
          const mergedCoupons = guestCoupons.map(guestCoupon => 
            myCouponsMap.get(guestCoupon.campaignId) || guestCoupon
          );
          setCoupons(mergedCoupons);
        } else {
          setCoupons(guestCoupons);
        }
      } else {
        setCoupons(guestCoupons);
      }
      
    } catch (error) {
      console.error("Failed to refetch claimable coupons", error);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, [productId, isLoggedIn, cookies]);

  useEffect(() => {
    if (productId) {
      refreshCoupons();
    }
  }, [productId, refreshCoupons]);

  const handleDownloadCoupon = async (campaignId: number) => {
    const authUserId = cookies['access-token'];
    if (!authUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }
    try {
      const result = await downloadCoupon({ campaignId, authUserId });
      if (result) {
        alert("쿠폰이 발급되었습니다!");
        await refreshCoupons();
      }
    } catch (error) {
      console.error("쿠폰 다운로드에 실패하였습니다.", error);
    }
  };

  return {
    coupons,
    isLoading,
    handleDownloadCoupon,
  };
};
