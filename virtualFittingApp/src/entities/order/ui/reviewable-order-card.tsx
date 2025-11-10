import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatSimpleDate } from "@/shared/lib/date.util";
import type { OrderItem } from "../model/types";
import img_alert from "@/shared/assets/images/alert-fallback.png";
import { CardHeader, DateText, ActiveDivider, Price } from "./canceled-order-card";

export type ReviewOrderPayload = {
  orderId: string;
  item: OrderItem;
  deadline?: string; 
};

export function ReviewableOrderCard({ order }: { order: ReviewOrderPayload }) {
  const navigate = useNavigate();
  const { item } = order;

  return (
    <div>
      <CardHeader>
        <DateText>{formatSimpleDate(item.date)}</DateText>
      </CardHeader>
      
      <ActiveDivider />
      
      <OrderCard>
        <ImageBox src={item.productImageUrl || img_alert} alt="상품 이미지" onClick={() => navigate(`/products/${item.productId}`)} />
        <RightSection>
          <TitleLine>
            {/* <Brand>{item.brand}</Brand> */}
            <Brand>Basilium</Brand>
          </TitleLine>
          <ProductName>{item.productName}</ProductName>
          <OptionText>
            {item.options.color} / {item.options.size} / {item.options.quantity}개
          </OptionText>
          <Price>{item.price.toLocaleString()}원</Price>
        </RightSection>
      </OrderCard>
    </div>
  );
}

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const ImageBox = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 2px;
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Brand = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #fff;
`;

const ProductName = styled.div`
  font-size: 14px;
  color: white;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 13px;
  color: #bbbbbb;
  text-align: left;
`;
