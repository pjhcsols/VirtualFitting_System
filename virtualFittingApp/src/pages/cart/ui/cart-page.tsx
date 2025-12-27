import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { CartItemList } from '@/widgets';
import { PaymentSummary } from "@/widgets/payment-summary";
import { useMyCartQuery } from "@/entities/cart";
import { useCartTotals } from '@/features/cart';
import type { ClaimableCoupon } from '@/entities/coupon';
import { Cookies } from 'react-cookie';
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';

import type { CheckoutItemDetail } from '@/shared/types/checkout';
import { useBatchPaymentReservation } from '@/features/process-checkout/hooks/use-batch-payment-reservation';

const cookiesInstance = new Cookies();

type CartItemWithStatus = CheckoutItemDetail & { isSoldOut: boolean };

function CartPage() {
  const location = useLocation();
  const [selectedCouponMap, setSelectedCouponMap] = useState<Map<number, ClaimableCoupon | null>>(new Map());
  const accessToken = cookiesInstance.get('access-token');

  const { data: cartData, isLoading: isCartLoading, refetch: refetchCart } = useMyCartQuery(accessToken!); 
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  const { reserveBatch, isLoading: isReserving } = useBatchPaymentReservation();
  
  useEffect(() => {
      if (!auth.isLoggedIn) {
        alert("로그인이 필요한 페이지입니다.");
        navigate('/login');
      }
  }, [auth.isLoggedIn, navigate, location, cartData]);

  const cartItems: CartItemWithStatus[] = cartData?.items
  ? cartData.items.map(item => ({
      id: item.itemId,
      productId: item.productId,
      name: item.productName,
      brand: item.brandFirmName,
      image: item.productPhotoUrls?.[0] ?? '',
      price: item.productPrice,
      discountedPrice: item.discountedPrice,
      discountRate: item.discountPercent ?? undefined,
      color: item.color as ProductColorPayment, 
      size: item.size as ProductSizePayment,
      quantity: item.quantity,
      isSoldOut: item.optionQuantity === 0,
  })) 
  : [];

  const totals = useCartTotals(cartItems, selectedCouponMap);
  const availableItems = useMemo(() => cartItems.filter(item => !item.isSoldOut), [cartItems]);
  const soldOutItems = useMemo(() => cartItems.filter(item => item.isSoldOut), [cartItems]);
  const availableItemsTotals = useCartTotals(availableItems, selectedCouponMap);

  const handleCouponSelect = (coupon: ClaimableCoupon | null, itemId: number) => {
      setSelectedCouponMap(prevMap => {
          const newMap = new Map(prevMap);
          newMap.set(itemId, coupon);
          return newMap;
      });
  };

  const handlePurchaseClick = async () => {
    if (!auth.isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }
    
    if (availableItems.length === 0) {
      if (soldOutItems.length > 0) {
        alert('장바구니에 담은 상품이 모두 품절되어 결제를 진행할 수 없습니다.');
      } else {
        alert('결제할 상품이 없습니다.');
      }
      return;
    }
    
    if (soldOutItems.length > 0) {
      const soldOutItemNames = soldOutItems.map(item => item.name).join(', ');
      alert(`품절된 상품(${soldOutItemNames})을 제외하고 결제를 진행합니다.`);
    }

    const reservationData = await reserveBatch(availableItems);

    if (reservationData) {
      navigate('/payment', {
        state: {
          checkoutData: { items: availableItems, finalPrice: availableItemsTotals.totalAmount },
          reservation: reservationData,
          isBatch: true,
        },
      });
    }
  };

  return (
    <PageContainer>
      <PageTitle>장바구니</PageTitle>
        <Layout>
          <MainContent>
            <CartItemList 
              cartItems={cartItems}
              isCartLoading={isCartLoading}
              selectedCouponMap={selectedCouponMap} 
              handleCouponSelect={handleCouponSelect}
              refetchCart={refetchCart}
              accessToken={accessToken}
            />
          </MainContent>
          <SideContent>
            <PaymentSummary 
              totals={totals} 
              onConfirm={handlePurchaseClick}
              confirmDisabled={isReserving}
            />
          </SideContent>
      </Layout>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #fff;
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
  min-width: 0;
  width: 100%;
`;

const SideContent = styled.aside`
  flex: 1;
  width: 100%;
  position: sticky;
  top: 80px;
`;

export { CartPage };