import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { ShippingAddressCard } from '@/entities/shipping-address';
import { ChangeShippingAddressButton } from '@/features/change-shipping-address';
import { OrderItemCard } from '@/entities/order-item';
import type { CartItem } from '@/entities/cart';
import type { ClaimableCoupon } from '@/entities/coupon';
import { useOrderForm } from '../hooks/use-order-form';
import { ProductCoupon } from '@/features/product-coupon';
import { useMemo, useState } from 'react';
import { calculateFinalPrice } from '@/shared/lib/price.util';

interface OrderFormProps {
  item: CartItem;
}

export const OrderForm = ({ item }: OrderFormProps) => {
  const { user, isLoading, handleSaveAddress } = useOrderForm();
  const [selectedCoupon, setSelectedCoupon] = useState<ClaimableCoupon | null>(null);

  const finalPrice = useMemo(() => {
    const basePrice = item.discountedPrice ?? item.price;
    return calculateFinalPrice(basePrice, item.quantity, selectedCoupon);
  }, [item, selectedCoupon]);

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

  const shippingAddress = {
    name: user.name,
    address: user.deliveryInfo.defaultDeliveryAddress,
    phone: user.phoneNumber,
  };

  return (
    <FormContainer>
      <GlassBox>
        <Header>
          <SectionTitle>배송지</SectionTitle>
          <ChangeShippingAddressButton onClick={handleSaveAddress}/>
        </Header>
        <ShippingAddressCard {...shippingAddress} />
      </GlassBox>
      <GlassBox>
        <Header>
          <SectionTitle>주문 상품</SectionTitle>
          <ProductCoupon 
            productId={item.productId}
            finalPrice={finalPrice}
            onSelect={setSelectedCoupon}
          />
        </Header>
        <OrderItemCard item={item} />
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
