import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { ShippingAddressCard } from '@/entities/shipping-address';
import { ChangeShippingAddressButton } from '@/features/change-shipping-address';
import type { UserDetail } from '@/entities/user';

interface ShippingAddressWidgetProps {
  user: UserDetail;
  onSaveAddress: () => void;
}

export const ShippingAddressWidget = ({ user, onSaveAddress }: ShippingAddressWidgetProps) => {
  const shippingAddress = {
    name: user.name,
    address: user.deliveryInfo.defaultDeliveryAddress,
    phone: user.phoneNumber,
  };

  return (
    <GlassBox>
      <Header>
        <SectionTitle>배송지</SectionTitle>
        <ChangeShippingAddressButton onClick={onSaveAddress} />
      </Header>
      <ShippingAddressCard {...shippingAddress} />
    </GlassBox>
  );
};

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