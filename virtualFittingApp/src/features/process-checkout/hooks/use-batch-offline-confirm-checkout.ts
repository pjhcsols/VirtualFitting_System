import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { 
  confirmOrderPurchase, 
} from '@/entities/order';
import { 
  createBatchPaymentReservation,
  createPaymentIntent,
  reportPaymentResult,
  confirmFinalPayment,
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

  
  const confirmAndProceed = async (checkoutData: BatchOfflineCheckoutData) => {
    setIsLoading(true);
    let reservedOrderId: string | undefined;

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

      const intentLines: PaymentIntentLine[] = checkoutData.items.map((item, index) => {
        const coupon = checkoutData.coupons[index]; 
        const walletId = (coupon as any)?.walletId;

        return {
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          couponWalletId: walletId ?? undefined,
        };
      });

      const intentBody = {
        orderId: reservedOrderId,
        currency: 'KRW',
        lines: intentLines,
        expiresAt: new Date(reservationData.expiresAt).toISOString(),
        pointsToUse: 0,
      };

      const intentResponse = await createPaymentIntent(intentBody);

      const intentData = intentResponse?.data;
      if (!intentData) {
        throw new Error("결제 정보를 확정하는 데 실패했습니다.");
      }
      const FINAL_PAYMENT_KEY = `TEMP-${Date.now()}`;

      const confirmationParams = {
        paymentType: checkoutData.paymentMethod,
        amount: intentData.serverTotal,
        orderId: intentData.orderId,
        paymentKey: FINAL_PAYMENT_KEY,
      };

      await confirmFinalPayment(confirmationParams); 
      
      await reportPaymentResult({ reserveTaskOrderPayId: intentData.orderId, success: true });
      
      const authUserId = accessToken;
          const orderId = intentData.orderId;

      await confirmOrderPurchase(authUserId, orderId); 
      
      const itemIdsToDelete = checkoutData.items.map(item => item.id);

      await deleteCartItems(accessToken, itemIdsToDelete); 

      const displayItem = checkoutData.items[0];
      const isBatch = checkoutData.items.length > 1;

      const representativeItemForUI = {
        productName: isBatch
          ? `${displayItem.name} 외 ${checkoutData.items.length - 1}개`
          : displayItem.name,
        options: {
          color: displayItem.color,
          size: displayItem.size,
          quantity: checkoutData.items.reduce((sum: number, item) => sum + item.quantity, 0), // 총 수량
        },
        price: checkoutData.finalPrice,
      };

      navigate(`/mypage/order/confirmation`, { 
        replace: true,
        state: { 
          shippingAddress: checkoutData.shippingAddress,
          orderId: intentData.orderId,
          items: checkoutData.items,
          item: representativeItemForUI,
          totalAmount: checkoutData.finalPrice,
          senderName: checkoutData.customerName,
          deadline: reservationData.expiresAt,
        }
    });

    } catch (error: any) {
      console.error("Payment confirmation failed:", error);

      if (reservedOrderId) {
        try {
            await reportPaymentResult({ reserveTaskOrderPayId: reservedOrderId, success: false });
        } catch (rollbackError) {
        }
      }
      alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  return { confirmAndProceed, isLoading };
};