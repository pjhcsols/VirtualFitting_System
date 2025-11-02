import styled from 'styled-components';
import { formatPhoneNumber } from '@/shared/lib/format.util';

interface ShippingAddressCardProps {
  name: string;
  address: string;
  phone: string;
}

export const ShippingAddressCard = ({ name, address, phone }: ShippingAddressCardProps) => {
  return (
    <CardContainer>
      <Name>{name}</Name>
      <InfoText>{address}</InfoText>
      <InfoText>{formatPhoneNumber(phone)}</InfoText>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  padding-top: 20px;
  text-align: left;
`;

const Name = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: white;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: white;
  line-height: 1.4;
  margin: 0;
`;
