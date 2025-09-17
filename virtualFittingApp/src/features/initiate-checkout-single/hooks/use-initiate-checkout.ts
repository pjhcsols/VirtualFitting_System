import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { createPaymentReservation } from '@/entities/payment/api';
import type { ProductColorPayment, ProductSizePayment, PaymentMethod } from '@/entities/payment';

export interface CheckoutInfo {
  productId: number;
  productName: string;
  productColor: ProductColorPayment;
  productSize: ProductSizePayment;
  quantity: number;
  finalPrice: number;
  couponWalletId?: number;
  paymentMethod: PaymentMethod;
}

export const useInitiateCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();

  const initiateCheckout = async (info: CheckoutInfo) => {
    setIsLoading(true);
    try {
      const accessToken = cookies['access-token'];
      if (!accessToken) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      const reservationResponse = await createPaymentReservation({
        productId: info.productId,
        productColor: info.productColor,
        productSize: info.productSize,
        count: info.quantity,
        userId: accessToken
      });

      const reservationData = reservationResponse?.data;
      if (!reservationData?.reserveTaskOrderPayId) {
        throw new Error("결제 예약에 실패했습니다.");
      }
      navigate('/payment', {
         state: {
           intentInfo: {
             orderId: reservationData.reserveTaskOrderPayId,
             currency: info.finalPrice,
             lines: [{
               productId: info.productId,
               size: info.productSize,
               color: info.productColor,
               quantity: info.quantity,
               couponWalletId: info.couponWalletId
             }],
             expiresAt: reservationData.expiresAt,
             pointsToUse: 0
           },
           paymentInfo: {
             orderName: info.productName,
             paymentMethod: info.paymentMethod
           }
         }
       });
 
     } catch (error: any) {
       console.error("Checkout initiation failed:", error);
       alert(`결제 준비 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
     } finally {
       setIsLoading(false);
     }
   };
 
   return { initiateCheckout, isLoading };
};