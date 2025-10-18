import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { 
    createPaymentReservation,
    createPaymentIntent,
    reportPaymentResult,
 } from '../api/payment.api';
import type { CartItem } from '@/entities/cart';
import type { ClaimableCoupon, CouponInWallet } from '@/entities/coupon';
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';

export interface SingleOfflineCheckoutData {
  item: CartItem;
  coupon: ClaimableCoupon | CouponInWallet | null;
  paymentMethod: "BANK_TRANSFER"
  finalPrice: number;
  customerName: string;
  customerEmail: string;
}

export const useSingleOfflineConfirmCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);
  
  const confirmAndProceed = async (checkoutData: SingleOfflineCheckoutData) => {
    setIsLoading(true);
    try {
      if (!isLoggedIn) {
        alert("결제 처리를 위해 로그인이 필요합니다.");
        navigate('/login');
        return;
      }
      const accessToken = cookies['access-token'];
      
      const reservationResponse = await createPaymentReservation({
        productId: checkoutData.item.productId,
        productColor: checkoutData.item.color as ProductColorPayment,
        productSize: checkoutData.item.size as ProductSizePayment,
        count: checkoutData.item.quantity,
        userId: accessToken,
      });

      const reservationData = reservationResponse?.data;
      if (!reservationData?.reserveTaskOrderPayId) {
        throw new Error("상품 재고를 예약하는 데 실패했습니다.");
      }
      const reservedOrderId = reservationData.reserveTaskOrderPayId;
      console.log(reservedOrderId);
      const intentResponse = await createPaymentIntent({
        orderId: reservedOrderId,
        currency: 'KRW',
        lines: [{
          productId: checkoutData.item.productId,
          size: checkoutData.item.size,
          color: checkoutData.item.color,
          quantity: checkoutData.item.quantity,
          couponWalletId: (checkoutData.coupon as CouponInWallet)?.walletId,
        }],
        expiresAt: new Date(reservationData.expiresAt).toISOString(),
        pointsToUse: 0, //[세아] 수정해야돼.... 
      });

      const intentData = intentResponse?.data;
      if (!intentData) {
        throw new Error("결제 정보를 확정하는 데 실패했습니다.");
      }

      await reportPaymentResult({ reserveTaskOrderPayId: intentData.orderId, success: true });

      navigate(`/mypage/order/confirmation`, { replace: true });

    //   sessionStorage.setItem('paymentMethod', checkoutData.paymentMethod);

    } catch (error: any) {
      console.error("Payment confirmation failed:", error);
      alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  return { confirmAndProceed, isLoading };
};

