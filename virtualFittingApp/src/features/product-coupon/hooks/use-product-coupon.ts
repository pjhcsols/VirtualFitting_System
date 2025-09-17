import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { type ClaimableCoupon } from '@/entities/coupon';
import { fetchClaimableCoupons, downloadCoupon } from '@/entities/coupon/api';

// type OnSelectCoupon = (coupon: ClaimableCoupon | null) => void;

// export const useProductCoupon = (productId: number, onSelect: OnSelectCoupon) => {
export const useProductCoupon = (productId: number) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<ClaimableCoupon | null>(null);
  const [downloadedCoupon, setDownloadedCoupon] = useState<{ walletId: number; campaignId: number; } | null>(null);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  const refreshCoupons = async () => {
    try {
      const accessToken = cookies['access-token'];
      const data = await fetchClaimableCoupons(productId, accessToken);
      setCoupons(data ?? []);
    } catch (error) {
      console.error("Failed to refetch claimable coupons", error);
    }
  };

  useEffect(() => {
    if (productId) refreshCoupons();
  }, [productId]);

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
        alert("쿠폰이 발급되었습니다.");
        setDownloadedCoupon(result);
        refreshCoupons();
      }
    } catch (error) {
      console.error("쿠폰 다운로드에 실패하였습니다.", error);
    }
  };

  const handleSelectCoupon = (coupon: ClaimableCoupon | null) => {
    const newSelectedCoupon = (!coupon || selectedCoupon?.campaignId === coupon.campaignId) ? null : coupon;
    setSelectedCoupon(newSelectedCoupon);
    // onSelect(newSelectedCoupon);
    setShowCouponPopup(false);
  };

  return {
    coupons,
    selectedCoupon,
    downloadedCoupon,
    showCouponPopup,
    setShowCouponPopup,
    handleDownloadCoupon,
    handleSelectCoupon,
  };
};