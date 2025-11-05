import styled from "styled-components";
import { formatSimpleDate } from "@/shared/lib/date.util";
import type { OrderItem } from "../model/types";
import img_alert from "@/shared/assets/images/alert-fallback.png";

export type ReviewOrderPayload = {
  orderId: string;
  deadline: string;
  item: OrderItem;
};

export function ReviewableOrderCard({ order }: { order: ReviewOrderPayload }) {
  const { orderId, deadline, item } = order;

  return (
    <div>
      <OrderCard>
        {/* <ImageBox src={item.productImageUrl || img_alert} alt="상품 이미지" /> */}
        <ImageBox src={img_alert} alt="상품 이미지" />
        <RightSection>
          <TitleLine>
            {/* <Brand>{item.brand}</Brand> */}
            <Brand>Basilium</Brand>
          </TitleLine>
          <ProductName>{item.productName}</ProductName>
          <OptionText>
            {item.options.color} / {item.options.size} / {item.options.quantity}개
            {" | "}
            {formatSimpleDate(item.date)} 구매
          </OptionText>
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
  width: 120px;
  height: 130px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 8px;
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Brand = styled.div`
  font-weight: bold;
  font-family: "Prata-Regular";
  font-size: 18px;
  color: #fff;
`;

const ProductName = styled.div`
  font-size: 16px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
`;
