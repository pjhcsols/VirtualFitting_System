import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil'; // ✅ 1. Recoil 훅 import
import { authState } from '@/entities/auth';   // ✅ 2. authState atom import
import type { CartItem } from '@/entities/cart';

export const useInitiateCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // ✅ 3. Recoil의 로그인 상태를 실시간으로 구독합니다.
  const isLoggedIn = useRecoilValue(authState);

  const initiateCheckout = (item: CartItem) => {
    setIsLoading(true);
    try {
      // ✅ 4. 이제 cookies 대신, 항상 최신 상태를 반영하는 isLoggedIn 변수를 확인합니다.
      if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        navigate('/login');
        return;
      }
      
      console.log("주문서 페이지로 이동하는 데이터:", item);
      navigate('/checkout', { state: { item: item } });

    } catch (error: any) {
      console.error("Checkout initiation failed:", error);
      alert(`주문서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  return { initiateCheckout, isLoading };
};

