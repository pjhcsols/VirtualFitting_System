import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { OrderForm } from '@/widgets/order-form';
import { ShippingAddressWidget } from '@/widgets/shipping-address';
import { PaymentSummary } from '@/widgets/payment-summary';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon } from '@/entities/coupon';
import { PaymentReservationData, fetchReservationStatus } from '@/entities/payment';
import { BREAKPOINTS } from '@/shared';
import { 
  useBatchOfflineConfirmCheckout,
  useSingleOfflineConfirmCheckout, 
  PaymentSelectionModal,
  BatchOfflineCheckoutData,
  SingleOfflineCheckoutData,
} from '@/features/process-checkout';
import { useOrderForm as useUserForm } from '@/entities/user';
import { useAddToCart } from '@/features/add-to-cart';

const calculateItemCouponDiscount = (
  itemPriceAfterBrandDiscount: number,
  itemQuantity: number,
  coupon: ClaimableCoupon
): number => {
  const itemTotalBasePrice = itemPriceAfterBrandDiscount * itemQuantity;
  const calculatedDiscount = Math.floor(itemTotalBasePrice * (coupon.percent / 100));
  return Math.min(calculatedDiscount, coupon.maxDiscountPrice);
};

export const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alertedRef = useRef(false);

  const batchCheckoutData = location.state?.checkoutData as { items: CheckoutItemDetail[], finalPrice: number } | undefined;
  const singleItem = location.state?.item as CheckoutItemDetail;
  const reservationData = location.state?.reservation as PaymentReservationData;
  
  const isBatchCheckout = !!batchCheckoutData;
  const itemsToCheckout = useMemo(() => 
    isBatchCheckout ? batchCheckoutData.items : (singleItem ? [singleItem] : []),
    [isBatchCheckout, batchCheckoutData, singleItem]
  );

  const { user, isLoading: isUserLoading, handleSaveAddress } = useUserForm();
  const auth = useRecoilValue(authState);
  
  const singleHook = useSingleOfflineConfirmCheckout();
  const batchHook = useBatchOfflineConfirmCheckout();
  const addToCartMutation = useAddToCart();

  const [selectedCouponMap, setSelectedCouponMap] = useState<Map<number, ClaimableCoupon | null>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const excludedWalletIds = useMemo(() => {
    const ids = new Set<number>();
    
    selectedCouponMap.forEach(coupon => {
      if (coupon && coupon.walletId) { 
          ids.add(coupon.walletId);
      }
    });
    return Array.from(ids);
  }, [selectedCouponMap]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login');
    }
    if (itemsToCheckout.length === 0) {
        navigate('/'); 
    }
    if (!isBatchCheckout && !reservationData) {
      alert("잘못된 접근입니다. 결제 정보가 없습니다.");
      navigate('/cart');
    }
  }, [auth.isLoggedIn, navigate, itemsToCheckout, isBatchCheckout, reservationData]);

  useEffect(() => {
    if (!reservationData?.expiresAt) return;

    const intervalId = setInterval(() => {
      if (alertedRef.current) return;

      const expirationTime = new Date(reservationData.expiresAt).getTime();
      const currentTime = Date.now();
      const fiveSeconds = 5 * 1000;

      if (expirationTime - currentTime < fiveSeconds) {
        alertedRef.current = true;
        clearInterval(intervalId);

        alert(
          '장바구니 상품들의 예약 시간이 만료되었습니다. 장바구니로 이동하여 다시 결제를 시도해주세요.'
        );
        navigate('/cart');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [reservationData?.expiresAt, navigate]);


  const paymentTotals = useMemo(() => {
    let productAmount = 0; 
    let totalDiscountedPrice = 0; 
    let totalCouponDiscount = 0; 

    itemsToCheckout.forEach(item => {
      const itemOriginalAmount = item.price * item.quantity;
      const itemDiscountedAmount = (item.discountedPrice ?? item.price) * item.quantity;
      
      productAmount += itemOriginalAmount;
      totalDiscountedPrice += itemDiscountedAmount; 
      
      const selectedCoupon = selectedCouponMap.get(item.id);

      if (selectedCoupon && selectedCoupon.walletId !== null) {
        const couponDiscount = calculateItemCouponDiscount(
          item.discountedPrice ?? item.price,
          item.quantity,
          selectedCoupon
        );
        totalCouponDiscount += couponDiscount;
      }
    });

    const totalBrandDiscount = productAmount - totalDiscountedPrice;
    const finalProductPrice = totalDiscountedPrice - totalCouponDiscount;
    const totalDiscount = totalBrandDiscount + totalCouponDiscount;
    const shippingFee = finalProductPrice >= 50000 ? 0 : 3000;
    const finalPayableAmount = finalProductPrice + shippingFee;

    return {
      productAmount,
      totalBrandDiscount,
      totalCouponDiscount,
      finalDiscount: Math.max(0, totalDiscount), 
      shippingFee,
      totalAmount: Math.max(0, finalPayableAmount),
    };
  }, [itemsToCheckout, selectedCouponMap]);

  const handleCouponSelect = (coupon: ClaimableCoupon | null, itemId: number) => {
    setSelectedCouponMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(itemId, coupon);
      return newMap;
    });
  };

  const handleConfirm = async () => {
    if (!user?.address?.address || !user?.address?.detailAddress) {
      alert("배송지 정보를 입력해주세요.");
      return;
    }

    try {
      const response = await fetchReservationStatus(reservationData.reserveTaskOrderPayId);

      if (response?.data.status === 'ACTIVATED') {
        setIsModalOpen(true);
      } else if (response?.data.status === 'INACTIVE') {
        if (isBatchCheckout) {
            alert('장바구니 상품들의 예약 시간이 만료되었습니다. 장바구니로 이동하여 다시 결제를 시도해주세요.');
            navigate('/cart');
        } else {
          if (auth.userId) {
            addToCartMutation.mutate({
              authUserId: auth.userId,
              itemData: {
                productId: singleItem.productId,
                size: singleItem.size,
                color: singleItem.color,
                quantity: singleItem.quantity,
                brandUserNumber: 0, 
                brandFirmName: singleItem.brand,
              }
            }, {
              onSuccess: () => {
                alert('상품 예약 시간이 만료되어 상품을 장바구니에 다시 담았습니다. 장바구니로 이동합니다.');
                navigate('/cart');
              },
              onError: () => {
                alert('일시적인 오류로 상품을 장바구니에 담지 못했습니다. 잠시 후 다시 시도해주세요.');
              }
            });
          } else {
              alert('로그인이 만료되었습니다. 다시 로그인 후 결제를 진행해주세요.');
          }
        }
      } else {
        alert('예약 상태를 확인할 수 없습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error("Error checking reservation status:", error);
      alert('예약 상태 확인 중 오류가 발생했습니다.');
    }
  };

  const handlePayment = async (selectedMethod: string) => {
    setIsModalOpen(false);
    
    if (!user || itemsToCheckout.length === 0) return; 

    try {
      const response = await fetchReservationStatus(reservationData.reserveTaskOrderPayId);

      if (response?.data.status === 'ACTIVATED') {
        const shippingAddress = {
          name: user.name,
          address: `(${user.address.zonecode}) ${user.address.address} ${user.address.detailAddress}`,
          phone: user.phoneNumber,
        };
    
        const sharedCheckoutData = {
          paymentMethod: selectedMethod as "BANK_TRANSFER",
          finalPrice: paymentTotals.totalAmount,
          customerName: user.name,
          customerEmail: user.emailAddress,
          shippingAddress: shippingAddress,
        };
    
        if (isBatchCheckout) {
          if (!reservationData) {
            alert("결제 예약 정보가 없습니다. 다시 시도해주세요.");
            return;
          }
          const finalBatchData: BatchOfflineCheckoutData = {
            ...sharedCheckoutData,
            items: itemsToCheckout,
            coupons: itemsToCheckout.map(item => selectedCouponMap.get(item.id) || null),
            reservation: reservationData,
          };
          batchHook.confirmAndProceed(finalBatchData);
        } else {
          if (!reservationData) {
            alert("결제 예약 정보가 없습니다. 다시 시도해주세요.");
            return;
          }
          const finalSingleData: SingleOfflineCheckoutData = {
            ...sharedCheckoutData,
            item: itemsToCheckout[0],
            coupon: selectedCouponMap.get(itemsToCheckout[0].id) || null,
            reservation: reservationData,
          }; 
          singleHook.confirmAndProceed(finalSingleData);
        }
      } else {
        if (isBatchCheckout) {
            alert('장바구니 상품들의 예약 시간이 만료되었습니다. 장바구니로 이동하여 다시 결제를 시도해주세요.');
            navigate('/cart');
        } else {
          if (auth.userId) {
            addToCartMutation.mutate({
              authUserId: auth.userId,
              itemData: {
                productId: singleItem.productId,
                size: singleItem.size,
                color: singleItem.color,
                quantity: singleItem.quantity,
                brandUserNumber: 0, 
                brandFirmName: singleItem.brand,
              }
            }, {
              onSuccess: () => {
                alert('상품 예약 시간이 만료되어 상품을 장바구니에 다시 담았습니다. 장바구니로 이동합니다.');
                navigate('/cart');
              },
              onError: () => {
                alert('일시적인 오류로 상품을 장바구니에 담지 못했습니다. 잠시 후 다시 시도해주세요.');
              }
            });
          } else {
              alert('로그인이 만료되었습니다. 다시 로그인 후 결제를 진행해주세요.');
          }
        }
      }
    } catch (error) {
      console.error("Error checking reservation status:", error);
      alert('예약 상태 확인 중 오류가 발생했습니다.');
    }
  };

  if (itemsToCheckout.length === 0) return <PageContainer>결제 정보를 불러올 수 없습니다.</PageContainer>;

  return (
    <PageContainer>
      <Layout>
        <MainContent>
          <FormContainer>
            {!isUserLoading && user && (
                <ShippingAddressWidget 
                  user={user}
                  onSaveAddress={handleSaveAddress}
                />
              )}
            <OrderForm 
              items={itemsToCheckout}
              selectedCouponMap={selectedCouponMap}
              onSelectCoupon={handleCouponSelect}
              excludedWalletIds={excludedWalletIds}
            />
          </FormContainer>
        </MainContent>
        <SideContent>
          <PaymentSummary 
            totals={paymentTotals} 
            onConfirm={handleConfirm}
          />
        </SideContent>
      </Layout>
      <PaymentSelectionModal 
        item={itemsToCheckout[0]}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
        totalAmount={paymentTotals.totalAmount}
        selectedCoupon={selectedCouponMap.get(itemsToCheckout[0]?.id) || null}
      />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
  
  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 2;
  width: 100%;
`;

const SideContent = styled.aside`
  flex: 1;
  width: 100%;
  position: sticky;
  top: 80px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;