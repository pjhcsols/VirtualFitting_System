import { useState } from 'react';
import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import { CartItemList } from '@/widgets';
import { PaymentSummary } from "@/widgets/payment-summary";
import { useMyCartQuery } from "@/entities/cart";
import { useCartTotals } from '@/features/cart';
import type { ClaimableCoupon } from '@/entities/coupon';
import { Cookies } from 'react-cookie';
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';

const cookiesInstance = new Cookies();

function CartPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCouponMap, setSelectedCouponMap] = useState<Map<number, ClaimableCoupon | null>>(new Map());
    
    const accessToken = cookiesInstance.get('access-token');

    const { data: cartData, isLoading: isCartLoading, refetch: refetchCart } = useMyCartQuery(accessToken!); 
    
    const cartItems = cartData?.items 
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
        })) 
        : []; 

    const totals = useCartTotals(cartItems, selectedCouponMap);

    const handleCouponSelect = (coupon: ClaimableCoupon | null, itemId: number) => {
        setSelectedCouponMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(itemId, coupon);
            return newMap;
        });
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
                      onConfirm={() => setIsModalOpen(true)}
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
