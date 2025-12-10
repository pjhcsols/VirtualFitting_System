import { useNavigate } from 'react-router-dom';
import { formatSimpleDate } from '@/shared/lib/date.util';
import type { OrderItem } from '../model/types';
import { StyledGlassCard, CardHeader, DateText, ActiveDivider, OrderCard, ImageBox, RightSection, TitleLine, Brand, OrderDetail, ProductName, OptionText, Price, ButtonWrapper } from './canceled-order-card';
import { ActionButton } from '@/features/review-actions/review-actions';

type Props = { order: OrderItem };

export function OrderSummaryCard({ order }: Props) {
  const navigate = useNavigate();

  return (
    <StyledGlassCard borderRadius="16px">
      {/* 헤더 */}
      <CardHeader>
        <DateText>{formatSimpleDate(order.date)}</DateText>
      </CardHeader>

      <ActiveDivider />

      {/* 본문 */}
      <OrderCard>
        <ImageBox src={order.productImageUrl} alt={order.productName} onClick={() => navigate(`/products/${order.productId}`)}/>
        <RightSection>
          <TitleLine>
            <Brand>{order.brand}</Brand>
            {/* <OrderDetail onClick={() => navigate(`/mypage/order/${order.id}`)}>
              주문 상세 ›
            </OrderDetail> */}
          </TitleLine>
          <ProductName>{order.productName}</ProductName>
          <OptionText>
            {order.options.color} / {order.options.size} / {order.options.quantity}개
          </OptionText>
          <Price>{order.price.toLocaleString()}원</Price>
        </RightSection>
      </OrderCard>

      <ActiveDivider />

      {/* 액션 */}
      <ButtonWrapper>
        {/* <ActionButton size="medium">배송조회</ActionButton> */}
        <ActionButton size="medium">재구매</ActionButton>
        <ActionButton size="medium">문의하기</ActionButton>
      </ButtonWrapper>
    </StyledGlassCard>
  );
}