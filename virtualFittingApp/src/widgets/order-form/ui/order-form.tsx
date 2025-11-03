import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { OrderItemCard } from '@/entities/order-item';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon } from '@/entities/coupon';
import { useOrderForm } from '../hooks/use-order-form';
import { ProductCoupon } from '@/features/coupon';

interface OrderFormProps {
  item: CheckoutItemDetail;
  selectedCoupon: ClaimableCoupon | null;
  onSelectCoupon: (coupon: ClaimableCoupon | null) => void;
  finalPrice: number;
}

export const OrderForm = ({ item, selectedCoupon, onSelectCoupon, finalPrice }: OrderFormProps) => {
  const { user, isLoading } = useOrderForm();

  if (isLoading || !user) {
    return (
      <FormContainer>
        <GlassBox>
          <Header>
            <SectionTitle>주문 상품</SectionTitle>
          </Header>
          <OrderItemCard item={item} />
        </GlassBox>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <GlassBox>
        <Header>
          <SectionTitle>주문 상품</SectionTitle>
          <ProductCoupon 
            productId={item.productId}
            finalPrice={finalPrice}
            onSelect={onSelectCoupon}
            currentSelectedCoupon={selectedCoupon}
          />
        </Header>
        <OrderItemCard item={item} finalPrice={finalPrice} />
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
