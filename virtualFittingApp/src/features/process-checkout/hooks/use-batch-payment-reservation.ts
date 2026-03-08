import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { createBatchPaymentReservation } from '@/entities/payment/api/payment.api';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { BatchPaymentRequestBody, PaymentReservationData, ProductColorPayment, ProductSizePayment } from '@/entities/payment/model/types';
import { useNavigate } from 'react-router-dom';

export const useBatchPaymentReservation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  const reserveBatch = async (items: CheckoutItemDetail[]): Promise<PaymentReservationData | null> => {
    if (isLoading) return null; 
    setIsLoading(true);
    try {
      if (!auth.isLoggedIn || !auth.userId) {
        alert("결제 처리를 위해 로그인이 필요합니다.");
        navigate('/login');
        return null;
      }

      const requestBody: BatchPaymentRequestBody = {
        items: items.map(item => ({
          productId: item.productId,
          productSize: item.size as ProductSizePayment,
          productColor: item.color as ProductColorPayment,
          count: item.quantity,
        })),
      };

      const reservationResponse = await createBatchPaymentReservation(auth.userId, requestBody);

      if (!reservationResponse?.data) {
        throw new Error("상품 재고를 예약하는 데 실패했습니다.");
      }
      
      return reservationResponse.data;

    } catch (error: any) {
      console.error("Batch payment reservation failed:", error);
      alert(`주문 예약 중 오류가 발생했습니다: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { reserveBatch, isLoading };
};
