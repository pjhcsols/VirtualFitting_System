import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import type { CartItem } from '@/entities/cart';

type InitiateCheckoutData = Omit<CartItem, 'id'>;

export const useInitiateCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const isLoggedIn = useRecoilValue(authState);

  const initiateCheckout = (item: InitiateCheckoutData) => {
    setIsLoading(true);
    try {
      if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        navigate('/login');
        return;
      }
      
      navigate('/payment', { state: { item: item } });

    } catch (error: any) {
      console.error("Checkout initiation failed:", error);
      alert(`주문서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  return { initiateCheckout, isLoading };
};
