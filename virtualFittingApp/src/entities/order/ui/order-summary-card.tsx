import { useNavigate } from 'react-router-dom';
import { formatSimpleDate } from '@/shared/lib/date.util';
import type { OrderItem } from '../model/types';
import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';

type Props = { order: OrderItem };

export function OrderSummaryCard({ order }: Props) {
  const navigate = useNavigate();

  return (
    <CardWrapper>
      <DateText>{formatSimpleDate(order.date)}</DateText>
      <Divider />
      <OrderCard>
        <ImageBox
          src={order.productImageUrl}
          alt={order.productName}
        />
        <RightSection>
          <TitleLine>
            <Brand>{order.brand}</Brand>
            <OrderDetail onClick={() => navigate(`/mypage/order/${order.id}`)}>
              주문 상세 ›
            </OrderDetail>
          </TitleLine>
          <ProductName>{order.productName}</ProductName>
          <OptionText>
            {order.options.color} / {order.options.size} / {order.options.quantity}개
          </OptionText>
          <Price>{order.price.toLocaleString()}원</Price>
        </RightSection>
      </OrderCard>
      <ButtonWrapper>
        <ActionButton>배송 조회</ActionButton>
        <ActionButton>재구매</ActionButton>
        <ActionButton>문의하기</ActionButton>
      </ButtonWrapper>
    </CardWrapper>
  );
}

export const CardWrapper = styled.div`
  border-radius: 16px;
  padding: 24px;
  overflow: hidden;
  margin-bottom: 24px;

  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.15);

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 20px 16px;
  }
`;

export const DateText = styled.p`
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  margin-bottom: 16px;
`;

export const Divider = styled.hr`
  margin: 0 0 16px 0;
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
`;

export const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

export const ImageBox = styled.img`
  width: 72px;
  height: 86px;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  gap: 4px;
`;

export const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Brand = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #fff;
`;

export const OrderDetail = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

export const ProductName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
`;

export const OptionText = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
`;

export const Price = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  text-align: left;
  margin-top: auto;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const ActionButton = styled.button`
  flex: 1 1 auto;
  padding: 0 16px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background-color: #353b60ff;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;
