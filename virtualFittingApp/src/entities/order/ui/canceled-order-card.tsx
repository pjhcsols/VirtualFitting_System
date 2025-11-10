import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatSimpleDate } from '@/shared/lib/date.util';
import { BREAKPOINTS } from '@/shared';
import type { OrderItem } from '../model/types';
import { GlassBox } from '@/shared/components/glass-box';
import { ActionButton } from '@/features/review-actions/review-actions';

type Props = { order: OrderItem };

export function CanceledOrderCard({ order }: Props) {
  const navigate = useNavigate();

  return (
    <StyledGlassCard borderRadius="16px">
      <CardHeader>
        <DateText>{formatSimpleDate(order.date)}</DateText>
        <CategoryText>{order.category} 요청</CategoryText>
      </CardHeader>

      <ActiveDivider />

      <OrderCard>
        <ImageBox
          src={order.productImageUrl}
          alt="상품 이미지"
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

      <ActiveDivider />

      <ButtonWrapper>
        {order.category === "교환" ? (
          <>
            <ActionButton size="medium" aria-label="교환 상세 보기">교환 상세</ActionButton>
            <ActionButton size="medium" aria-label="교환 배송 조회">교환 배송 조회</ActionButton>
            <ActionButton size="medium" aria-label="회수 배송 조회">회수 배송 조회</ActionButton>
          </>
        ) : (
          <>
            <ActionButton size="medium" aria-label="문의하기">문의하기</ActionButton>
            <ActionButton size="medium" aria-label="배송 조회">배송조회</ActionButton>
            <ActionButton
              size="medium"
              aria-label="상세 보기"
              onClick={() => navigate(`/mypage/order/${order.id}`)}
            >
              상세보기
            </ActionButton>
          </>
        )}
      </ButtonWrapper>
    </StyledGlassCard>
  );
}

export const StyledGlassCard = styled(GlassBox)`
  width: 100%;
  padding: 16px 20px;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 14px 16px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;     
  padding: 4px 0;  
`;

export const DateText = styled.p`
  margin: 0;              
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;        
  color: #fff;
`;

export const CategoryText = styled.p`
  margin: 0;               
  font-size: 16px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.7);
`;

export const ActiveDivider = styled.div`
  margin: 8px 0 12px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.35) 50%,
    rgba(255,255,255,0) 100%
  );
  opacity: 0.7;
`;

export const OrderCard = styled.div`
  display: flex;
  gap: 20px;                 
  width: 800px;
  padding: 10px 2px;        
  
  @media (max-width: ${BREAKPOINTS.md}px) {
    gap: 14px;
    padding: 8px 0;
  }
`;

export const ImageBox = styled.img`
  width: 120px;              
  height: 130px;             
  background-color: #d9d9d9;
  border-radius: 10px;       
  object-fit: cover;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 72px;
    height: 86px;
    border-radius: 8px;
  }
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 6px;              
`;

export const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Brand = styled.div`
  font-weight: 600; 
  font-family: "Prata-Regular";
  font-size: 18px;
  color: #fff;
`;

export const OrderDetail = styled.div`
  font-size: 16px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.6);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

export const ProductName = styled.div`
  font-size: 16px; 
  font-family: "Prata-Regular";          
  font-weight: 600;          
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.95);
  text-align: left;
`;

export const OptionText = styled.div`
  font-size: 14px; 
  font-family: "Prata-Regular";         
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
`;

export const Price = styled.div`
  font-weight: 700;
  font-family: "Prata-Regular";
  font-size: 16px;          
  color: #fff;
  text-align: left;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px; 
  flex-wrap: wrap;
  justify-content: flex-start;
`;

