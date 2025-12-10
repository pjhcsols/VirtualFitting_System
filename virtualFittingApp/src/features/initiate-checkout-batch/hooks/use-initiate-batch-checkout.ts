import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import type { CheckoutItemDetail } from '@/shared/types/checkout'; 

export const useInitiateBatchCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);

  const initiateBatchCheckout = (data: { items: CheckoutItemDetail[], totals: { totalAmount: number } }) => {
    setIsLoading(true);
    try {
      if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        navigate('/login');
        return;
      }
      
      if (!data.items || data.items.length === 0) {
           throw new Error("결제할 상품 목록이 없습니다.");
      }
      
      const checkoutData = {
          items: data.items,
          finalPrice: data.totals.totalAmount
      };

      navigate('/payment', { 
          state: { isBatch: true, checkoutData: checkoutData }
      });

    } catch (error: any) {
      console.error("Batch checkout initiation failed:", error);
      alert(error.message || `주문서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  return { initiateBatchCheckout, isLoading };
};