import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatSimpleDate } from '@/shared/lib/date.util';
import { BREAKPOINTS } from '@/shared';
import type { OrderItem } from '../model/types';

type Props = { order: OrderItem };

export function CanceledOrderCard({ order }: Props) {
  const navigate = useNavigate();

  return (
    <GlassCard>
      <CardHeader>
        <DateText>{formatSimpleDate(order.date)}</DateText>
        <CategoryText>{order.category} 요청</CategoryText>
      </CardHeader>

      <Divider />

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

      <ButtonWrapper>
        {order.category === "교환" ? (
          <>
            <ActionButton>교환 상세</ActionButton>
            <ActionButton>교환 배송 조회</ActionButton>
            <ActionButton>회수 배송 조회</ActionButton>
          </>
        ) : (
          <>
            <ActionButton>문의하기</ActionButton>
            <ActionButton>배송조회</ActionButton>
            <ActionButton>상세보기</ActionButton>
          </>
        )}
      </ButtonWrapper>
    </GlassCard>
  );
}

const GlassCard = styled.div`
  border-radius: 16px;
  padding: 24px; /* 내부 여백을 좀 더 확보 */
  overflow: hidden;

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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const DateText = styled.p`
  font-weight: 600; /* 800 -> 600 (너무 무겁지 않게) */
  font-size: 15px; /* 약간 작게 조정 */
  color: #fff;
`;

const CategoryText = styled.p`
  font-size: 13px; /* 약간 작게 조정 */
  color: rgba(255, 255, 255, 0.7); /* 대비를 위해 약간 더 투명하게 */
`;

const Divider = styled.hr`
  margin: 0 0 16px 0; /* 헤더와 본문 사이 구분선 */
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const ImageBox = styled.img`
  width: 72px;
  height: 86px;
  background-color: #d9d9d9;
  border-radius: 8px;
  object-fit: cover;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  gap: 1px;
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Brand = styled.div`
  font-weight: 600; /* bold -> 600 */
  font-size: 13px;
  color: #fff;
`;

const OrderDetail = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const ProductName = styled.div`
  font-size: 13px; /* 이름이 더 중요하므로 Brand보다 약간 크게 */
  font-weight: 500; /* 굵기를 조금 주어 강조 */
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 13px;
  color: #rgba(255, 255, 255, 0.8);
  text-align: left;
`;

const Price = styled.div`
  font-weight: 700; /* bold */
  font-size: 13px;
  color: #fff;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px; /* 카드 본문과 간격 추가 */
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  flex: 1 1 auto; /* 버튼 크기가 유연하게 조절되도록 */
  padding: 0 16px; /* 내부 패딩으로 크기 조절 */
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background-color: transparent; /* 배경을 투명하게 하여 더 깔끔하게 */
  color: rgba(255, 255, 255, 0.9);
  background-color: #353b60ff;
  font-size: 13px; /* 폰트 크기 조정 */
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

