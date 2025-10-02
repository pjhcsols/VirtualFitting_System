import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { formatSimpleDate } from '@/shared/lib/date.util';
import type { OrderItem } from '../model/types';
import img_alert from "@/shared/assets/images/alert-fallback.png";

type ReviewableOrderCardProps = {
  order: OrderItem;
  isFormHeader?: boolean; 
};

export function ReviewableOrderCard({ order }: ReviewableOrderCardProps) {
  const navigate = useNavigate();

  return (
    <div>
      <OrderCard>
        <ImageBox src={order.productImageUrl || img_alert} alt="상품 이미지" />
        <RightSection>
          <TitleLine>
            <Brand>{order.brand}</Brand>
          </TitleLine>
          <ProductName>{order.productName}</ProductName>
          <OptionText>
            {order.options.color} / {order.options.size} / {order.options.quantity}개 | {formatSimpleDate(order.date)} 구매
          </OptionText>
        </RightSection>
      </OrderCard>
    </div>
  );
}

export const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

export const ImageBox = styled.img`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 8px;
`;

export const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Brand = styled.div`
  font-weight: bold;
  font-family: "Prata-Regular";
  font-size: 14px;
  color: #fff;
`;

export const ProductName = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
`;

export const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
`;
