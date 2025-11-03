import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import type { ClaimableCoupon, CouponInWallet } from '@/entities/coupon';
import type { CheckoutItemDetail } from '@/shared/types/checkout'; 
import type { ShippingAddressData } from "@/entities/shipping-address";

export interface BatchCheckoutItemDetail extends CheckoutItemDetail {
    id: number;
    productId: number;
    name: string;
    brand: string;
    image: string;
    price: number;
    discountedPrice?: number;
}

export interface BatchOfflineCheckoutData {
  items: BatchCheckoutItemDetail[];
  coupons: (ClaimableCoupon | CouponInWallet | null)[]; 
  paymentMethod: "BANK_TRANSFER";
  finalPrice: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddressData; 
}

export const useInitiateBatchCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);

  const initiateBatchCheckout = (data: { items: BatchCheckoutItemDetail[], totals: { totalAmount: number } }) => {
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
          state: { checkoutData: checkoutData }
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