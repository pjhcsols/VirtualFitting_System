import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import type { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import alertImg from "@/pages/my/ui/alert.png";
import { formatSimpleDate } from "@/shared";
import { BREAKPOINTS } from "@/shared";

function OrderDetailContent() {
    const navigate = useNavigate();
    const location = useLocation();

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
        <PageWrapper>
            <ContentWrapper>
                <FormInner>
                     <Content>
                        <ContentLabel>{formatSimpleDate(order.date)}</ContentLabel>
                        <ContentText>
                            주문번호 : 0000111112222
                        </ContentText>
                    </Content>
                    <Divider/>

                    <Content>
                        <ContentLabel>김**</ContentLabel>
                        <RightSection>
                            <ContentText>
                                주소
                            </ContentText>
                            <ContentText>
                                전화번호
                            </ContentText>
                        </RightSection>
                    </Content>
                    <Divider/>

                    <Content>
                        <ContentLabel>주문상품</ContentLabel>
                    </Content>
                    <OrderCard>
                        <ImageBox src={order.productImageUrl || alertImg} alt="상품 이미지" />
                        <RightSection>
                        <TitleLine>
                            <Brand>{order.brand}</Brand>
                        </TitleLine>
                        <ProductName>{order.productName}</ProductName>
                        <OptionText>
                            {order.options.color} / {order.options.size} / {order.options.quantity}개
                        </OptionText>
                        <Price>{order.price.toLocaleString()}원</Price>
                        </RightSection>
                    </OrderCard>
                    <Divider />   
                </FormInner>
            </ContentWrapper>
        </PageWrapper>
    );
}

export { OrderDetailContent };


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: auto; 
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  padding: 100px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-bottom: 70px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
    padding: 88px 16px 20px;
  }
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 800px;
`;

const ImageBox = styled.img`
  width: 78px;
  height: 95px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
  background-position: center;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
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
  font-size: 14px;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  text-align: left;
`;

const ContentText = styled.div`
  font-size: 15px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  text-align: left;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
  max-width: 800px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 15px;
  margin-bottom: 50px;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  border: 1px solid rgb(228, 230, 233);
  background: rgb(255, 255, 255);
  border-radius: 6px;
  font-size: 14px;

  &::placeholder {
    color: rgb(150, 150, 150);
    font-weight: normal;
  }
`;

const ContentLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-family: "Prata-Regular";
  margin-bottom: 6px;
  width: 100%;
  max-width: 800px;
`;

const Price = styled.div`
  font-weight: bold;
  font-family: "Prata-Regular";
  font-size: 14px;
  margin-top: 4px;
  text-align: left;
`;




