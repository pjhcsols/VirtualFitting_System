import React, { useState } from 'react';
import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import type { OrderItem } from '../model/types';

type OrderInfoCardProps = {
  orderId: string;
  items: OrderItem[];
};

export const OrderInfoCard = ({ orderId, items }: OrderInfoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const firstItem = items[0];
  const remainingItems = items.slice(1);
  const hasMoreItems = remainingItems.length > 0;

  const renderItem = (item: OrderItem) => (
    <Content>
      <ProductImage src={item.productImageUrl} alt={item.productName} />
      <ProductDetails>
        <NameContainer>
          <Name>{item.productName}</Name>
          {item.id === firstItem.id && hasMoreItems && (
            <SeeMoreButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? '간략히 보기' : `외 ${remainingItems.length}개 더보기`}
            </SeeMoreButton>
          )}
        </NameContainer>
        <InfoText>
          {item.options.color} / {item.options.size} / {item.options.quantity}개
        </InfoText>
        <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>
      </ProductDetails>
    </Content>
  );

  return (
    <GlassBox>
      <Header>
        <InfoRow>
          <SectionTitle>주문 상품 정보</SectionTitle>
          <Value>{orderId}</Value>
        </InfoRow>
      </Header>

      {renderItem(firstItem)}

      {isExpanded && remainingItems.map(item => (
        <React.Fragment key={item.id}>
          <Divider />
          {renderItem(item)}
        </React.Fragment>
      ))}
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 24px;
  padding-top: 20px;
  text-align: left;
`;

const ProductImage = styled.img`
  width: 78px;
  height: 95px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
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

const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
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

const SeeMoreButton = styled.button`
  background: none;
  border: none;
  color: #white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  flex-shrink: 0;
`;