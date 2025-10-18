import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import type { OrderItem } from '../model/types';

type OrderInfoCardProps = {
  orderId: string;
  item: OrderItem;
};

export const OrderInfoCard = ({ orderId, item }: OrderInfoCardProps) => {
  return (
    <GlassBox>
      <Header>
        <InfoRow>
          <SectionTitle>주문 상품 정보</SectionTitle>
          <Value>{orderId}</Value>
        </InfoRow>
      </Header>
      <Content>
        <Name>{item.productName}</Name>
        <InfoText>
          {item.options.color} / {item.options.size} / {item.options.quantity}개
        </InfoText>
        <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>
      </Content>
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
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  padding-top: 20px;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Value = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  word-break: keep-all;
`;

const ProductPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
`;

const Name = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: white;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  margin: 0;
`;