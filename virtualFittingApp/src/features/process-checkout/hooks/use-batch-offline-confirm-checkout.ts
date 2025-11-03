import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { authState } from '@/entities/auth';
import {
    createBatchPaymentReservation,
    createPaymentIntent,
    reportPaymentResult,
 } from '@/entities/payment';
import type {
    BatchPaymentRequestBody,
    ReservedItem,
    PaymentIntentLine,
 } from '@/entities/payment';
import type { ClaimableCoupon, CouponInWallet } from '@/entities/coupon';
import type { ShippingAddressData } from "@/entities/shipping-address";
import type { CheckoutItemDetail } from '@/shared/types/checkout'; 
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';
import { deleteCartItems } from '@/entities/cart';

export interface BatchCheckoutItemDetail extends CheckoutItemDetail {
    id: number;
    productId: number;
    name: string;
    color: ProductColorPayment;
    size: ProductSizePayment;
    quantity: number;
}

export interface BatchOfflineCheckoutData {
  items: BatchCheckoutItemDetail[];
  coupons: (ClaimableCoupon | CouponInWallet | null)[]; 
  paymentMethod: "BANK_TRANSFER"
  finalPrice: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddressData;
}

const mapToBatchRequestItems = (checkoutData: BatchOfflineCheckoutData): ReservedItem[] => {
  return checkoutData.items.map(item => ({
    productId: item.productId,
    count: item.quantity,
    productSize: item.size,
    productColor: item.color,
  }));
};

export const useBatchOfflineConfirmCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);
  const queryClient = useQueryClient();

  
  const confirmAndProceed = async (checkoutData: BatchOfflineCheckoutData) => {
    setIsLoading(true);

     try {
      if (!isLoggedIn) {
        alert("결제 처리를 위해 로그인이 필요합니다.");
        navigate('/login');
        return;
      }
      const accessToken = cookies['access-token'];

      const batchRequestItems = mapToBatchRequestItems(checkoutData);
      const requestBody: BatchPaymentRequestBody = { items: batchRequestItems };

      const reservationResponse = await createBatchPaymentReservation(
        accessToken, 
        requestBody
      );

      const reservationData = reservationResponse?.data;
      if (!reservationData?.reserveTaskOrderPayId) {
        throw new Error("상품 재고를 예약하는 데 실패했습니다.");
      }
      const reservedOrderId = reservationData.reserveTaskOrderPayId;
      console.log(`[배치 예약 ID] ${reservedOrderId}`);

      const intentLines: PaymentIntentLine[] = checkoutData.items.map((item, index) => {
        const coupon = checkoutData.coupons[index]; 
        
        return {
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          couponWalletId: (coupon as CouponInWallet)?.walletId ?? undefined, 
        };
      });

      const intentBody = {
        orderId: reservedOrderId,
        currency: 'KRW',
        lines: intentLines,
        expiresAt: new Date(reservationData.expiresAt).toISOString(),
        pointsToUse: 0,
      };
      
      console.log("[결제 의도 생성 Body]", intentBody);

      const intentResponse = await createPaymentIntent(intentBody);

      const intentData = intentResponse?.data;
      if (!intentData) {
        throw new Error("결제 정보를 확정하는 데 실패했습니다.");
      }

      await reportPaymentResult({ reserveTaskOrderPayId: intentData.orderId, success: true });
      const itemIdsToDelete = checkoutData.items.map(item => item.id);
      console.log(`[장바구니 정리] 결제 완료된 아이템 ID: ${itemIdsToDelete.join(', ')}`);
      
      await deleteCartItems(accessToken, itemIdsToDelete);
      console.log("[장바구니 정리] 아이템 삭제 성공.");

      queryClient.invalidateQueries({ queryKey: ['coupons', 'claimables'] });
      console.log("[캐시 무효화] 모든 상품 쿠폰 쿼리를 무효화했습니다.");

      navigate(`/mypage/order/confirmation`, { 
        replace: true,
        state: { 
          shippingAddress: checkoutData.shippingAddress,
          orderId: intentData.orderId,
          items: checkoutData.items, // 전체 아이템 목록을 전달
          totalAmount: checkoutData.finalPrice,
          senderName: checkoutData.customerName,
          deadline: reservationData.expiresAt,
        } 
    });

    } catch (error: any) {
      console.error("Payment confirmation failed:", error);
      alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  return { confirmAndProceed, isLoading };
};