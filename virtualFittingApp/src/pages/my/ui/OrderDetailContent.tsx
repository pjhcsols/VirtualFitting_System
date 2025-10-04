import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import type { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import alertImg from "@/pages/my/ui/alert.png";
import { formatSimpleDate } from "@/shared";
import { GlassForm, Divider } from "@/widgets/review-form";
import { OrderCard, ImageBox, RightSection, TitleLine, Brand, ProductName, OptionText } from "@/entities/order";

function OrderDetailContent() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const foundOrder = orderDummyData.find((item) => item.id === id);
    setOrder(foundOrder || null);
  }, [id]);

  if (!order) {
    return <div>주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <GlassForm>
      <FormInner>
        <Content>
          <ContentLabel>{formatSimpleDate(order.date)}</ContentLabel>
          <ContentText>주문번호 : 0000111112222</ContentText>
        </Content>
        <Divider />

        <Content>
          <ContentLabel>김**</ContentLabel>
          <RightSection>
            <ContentText>대구광역시 동구</ContentText>
            <ContentText>010 - **** - 1234</ContentText>
          </RightSection>
        </Content>
        <Divider />

        <Content>
          <ContentLabel>주문상품</ContentLabel>
          <OrderCard>
            <ImageBox
              src={order.productImageUrl || alertImg}
              alt="상품 이미지"
            />
            <RightSection>
              <TitleLine>
                <Brand>{order.brand}</Brand>
              </TitleLine>
              <ProductName>{order.productName}</ProductName>
              <OptionText>
                {order.options.color} / {order.options.size} /{" "}
                {order.options.quantity}개
              </OptionText>
              <Price>{order.price.toLocaleString()}원</Price>
            </RightSection>
          </OrderCard>
        </Content>
        <Divider />


        <Content>
          <ContentLabel>결제 정보</ContentLabel>
          <RightSection>
            <ContentText>상품금액 : </ContentText>
            <ContentText>할인금액 : </ContentText>
            <ContentText>적립금 사용 : </ContentText>
            <ContentText>배송비 : </ContentText>
            <ContentText>결제 금액   : </ContentText>
            <ContentText>결제 수단 : </ContentText>
          </RightSection>
        </Content>
        <Divider />

      </FormInner>
    </GlassForm>
  );
}

export { OrderDetailContent };

const FormInner = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ContentText = styled.div`
  font-size: 15px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.5);
  text-align: left;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 15px;
  margin-bottom: 50px;
`;

const ContentLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-family: "Prata-Regular";
  color: #fff;
  margin-bottom: 10px;
  width: 100%;
  max-width: 800px;
`;

const Price = styled.div`
  font-weight: bold;
  font-family: "Prata-Regular";
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin-top: 4px;
  text-align: left;
`;
