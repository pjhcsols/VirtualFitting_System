import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { 
  confirmOrderPurchase, 
} from '@/entities/order';
import { 
  createPaymentReservation,
  createPaymentIntent,
  confirmFinalPayment,
  reportPaymentResult,
 } from '@/entities/payment';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon, CouponInWallet } from '@/entities/coupon';
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';
import type { ShippingAddressData } from "@/entities/shipping-address";
import { upsertCart } from '@/entities/cart';

export interface SingleOfflineCheckoutData {
  item: CheckoutItemDetail;
  coupon: ClaimableCoupon | CouponInWallet | null;
  paymentMethod: "BANK_TRANSFER"
  finalPrice: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddressData;
}

export const useSingleOfflineConfirmCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);

  
  const confirmAndProceed = async (checkoutData: SingleOfflineCheckoutData) => {
    setIsLoading(true);
    let reservedOrderId: string | undefined;

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
      const couponWalletId = (checkoutData.coupon as any)?.normalCouponWalletId 
                             ?? (checkoutData.coupon as any)?.walletId 
                             ?? undefined;

      const intentBody = {
        orderId: reservedOrderId,
        currency: 'KRW',
        lines: [{
          productId: checkoutData.item.productId,
          size: checkoutData.item.size,
          color: checkoutData.item.color,
          quantity: checkoutData.item.quantity,
          couponWalletId: couponWalletId,
        }],
        expiresAt: new Date(reservationData.expiresAt).toISOString(),
        pointsToUse: 0, // [seah] 포인트 적용할 수 있게 추후 수정필요
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

      navigate(`/mypage/order/confirmation`, { 
        replace: true,
        state: { 
          shippingAddress: checkoutData.shippingAddress,
          orderId: intentData.orderId,
          item: {
            productName: checkoutData.item.name,
            options: {
              color: checkoutData.item.color,
              size: checkoutData.item.size,
              quantity: checkoutData.item.quantity,
            },
            price: checkoutData.finalPrice,
          },
          totalAmount: checkoutData.finalPrice,
          senderName: checkoutData.customerName,
          deadline: reservationData.expiresAt,
        } 
    });

    } catch (error: any) {

      const itemToReAdd = checkoutData.item;
      let shouldReAddToCart = false;

      if (reservedOrderId) {
        try {
            await reportPaymentResult({ reserveTaskOrderPayId: reservedOrderId, success: false });
            shouldReAddToCart = true;
        } catch (rollbackError) {
            console.error("[재고 롤백 실패]", rollbackError);
        }
      }
      
      if (shouldReAddToCart) {
        const accessToken = cookies['access-token'];
          try {
              await upsertCart(accessToken, {
                  items: [{
                      productId: itemToReAdd.productId,
                      size: itemToReAdd.size,
                      color: itemToReAdd.color,
                      quantity: itemToReAdd.quantity,
                  }],
              });
          } catch (cartError) {
          }
      } else {
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { confirmAndProceed, isLoading };
};