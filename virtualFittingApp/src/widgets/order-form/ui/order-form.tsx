import styled from 'styled-components';
import { useState } from 'react';
import { GlassBox } from '@/shared/components/glass-box';
import { OrderItemCard } from '@/entities/order-item';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon } from '@/entities/coupon';
import { ProductCoupon, PaymentCouponButton } from '@/features/coupon';
import { calculateFinalPrice } from '@/shared/lib/price.util';

interface OrderFormProps {
  items: CheckoutItemDetail[];
  selectedCouponMap: Map<number, ClaimableCoupon | null>;
  onSelectCoupon: (coupon: ClaimableCoupon | null, itemId: number) => void;
  excludedWalletIds: number[];
}

export const OrderForm = ({ 
  items, 
  selectedCouponMap, 
  onSelectCoupon, 
  excludedWalletIds,
}: OrderFormProps) => {
  const [activeCouponModal, setActiveCouponModal] = useState<number | null>(null);

  return (
    <FormContainer>
      <GlassBox>
        <Header>
          <SectionTitle>주문 상품</SectionTitle>
        </Header>
        {items.map((item, index) => {
          const itemPrice = item.discountedPrice ?? item.price;
          const selectedCoupon = selectedCouponMap.get(item.id) || null;
          const finalPriceForItem = calculateFinalPrice(itemPrice, item.quantity, selectedCoupon);
          const excludedIdsForThisItem = excludedWalletIds.filter(id => id !== selectedCoupon?.campaignId);

          return (
            <ItemWrapper key={item.id}>
              <OrderItemCard item={item} finalPrice={finalPriceForItem} />
              <ButtonContainer>
                <PaymentCouponButton 
                  onClick={() => setActiveCouponModal(item.id)}
                />
                <ProductCoupon
                  productId={item.productId}
                  finalPrice={finalPriceForItem}
                  pageType="checkout" 
                  onSelect={(coupon) => onSelectCoupon(coupon, item.id)} 
                  currentSelectedCoupon={selectedCoupon} 
                  showPopup={activeCouponModal === item.id}
                  setShowPopup={() => setActiveCouponModal(null)}
                  excludedWalletIds={excludedIdsForThisItem}
                />
              </ButtonContainer>
              {index < items.length - 1 && <ItemSeparator />}
            </ItemWrapper>
          );
        })}
      </GlassBox>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const ItemWrapper = styled.div`
  position: relative;
  padding: 24px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
`;

const ItemSeparator = styled.div`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;
