import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { createPaymentReservation } from '@/entities/payment';
import type { CheckoutItemDetail } from '@/shared/types/checkout';

import type { 
    ProductColorPayment, 
    ProductSizePayment, 
    PaymentReservationData 
} from '@/entities/payment';

export const usePaymentReservation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(['access-token']);
  const isLoggedIn = useRecoilValue(authState);

  const reserve = async (item: CheckoutItemDetail): Promise<PaymentReservationData | null> => {
    setIsLoading(true);
      try {
        if (!isLoggedIn) {
          alert("결제 처리를 위해 로그인이 필요합니다.");
          navigate('/login');
          return null;
        }
  
        const accessToken = cookies['access-token'];
        
        const reservationResponse = await createPaymentReservation({
            productId: item.productId,
            productColor: item.color as ProductColorPayment,
            productSize: item.size as ProductSizePayment,
            count: item.quantity,
            userId: accessToken,
        });

      if (!reservationResponse?.data) {
        throw new Error("상품 재고를 예약하는 데 실패했습니다.");
      }
      
      return reservationResponse.data;

    } catch (error: any) {
      console.error("Payment reservation failed:", error);
      alert(`주문 예약 중 오류가 발생했습니다: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { reserve, isLoading };
};
