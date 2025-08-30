import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import { formatSimpleDate } from "@/shared";
import alertImg from "@/pages/my/ui/alert.png";
import { BREAKPOINTS } from "@/shared";

const HEADER_H = 52;

function CancelContentList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("전체");
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);

    useEffect(() => {
      setOrders(orderDummyData);
    }, []);
      
    useEffect(() => {
      if (activeTab === "전체") {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(
          orders.filter((order) => order.category === activeTab)
        );
      }
    }, [activeTab, orders]);

    if (!filteredOrders.length) {
      return (
        <EmptyWrapper>
          <AlertImage src={alertImg} alt="알림 아이콘" />
          <Message>구매하신 상품이 없습니다.</Message>
        </EmptyWrapper>
      );
    } 

    return (
      <OuterWrapper>
        <StickyTabWrapper>
          <TabInner>
            {["전체", "취소/반품", "교환"].map((tab) => (
              <TabText
                key={tab}
                onClick={() => setActiveTab(tab)}
                active={activeTab === tab}
              >
                {tab}
              </TabText>
            ))}
          </TabInner>
        </StickyTabWrapper>

        <ContentWrapper>
          <CardGrid>
            {filteredOrders.map((order) => (
            <GlassCard key={order.id}>
              <DateText>{formatSimpleDate(order.date)}</DateText>
              <CateogryText>{order.category} 요청</CateogryText>
              <OrderCard>
                <ImageBox
                  src={order.productImageUrl || alertImg}
                  alt="상품 이미지"
                />
                <RightSection>
                  <TitleLine>
                    <Brand>{order.brand}</Brand>
                    <OrderDetail>주문 상세</OrderDetail>
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
                    <ActionButton>A</ActionButton>
                    <ActionButton>B</ActionButton>
                    <ActionButton>C</ActionButton>
                  </>
                )}
              </ButtonWrapper>
            </GlassCard>
          ))}
          </CardGrid>
        </ContentWrapper>
      </OuterWrapper>
    );
}

export { CancelContentList };


const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StickyTabWrapper = styled.div`
  position: sticky;
  top: calc(var(--header-h, ${HEADER_H}px));
  z-index: 100;
  width: 100%;
  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  border-bottom: 1px solid rgba(255,255,255,0.25);
`;

const TabInner = styled.div`
  display: flex;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  padding: 10px 0;
  margin: 0 auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 10px 16px;
    max-width: 100%;
  }
`;

const TabText = styled.span<{ active: boolean }>`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.9)" : "#000")};
  cursor: pointer;
  font-family: "Prata-Regular";
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => (props.active ? "100%" : "0")};
    height: 2px;
    background-color: rgba(255, 255, 255, 0.9);
    transition: width 0.3s ease;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 0 16px;
    max-width: 100%;
  }
`;

const DateText = styled.p`
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: left;
  font-family: "Prata-Regular";
  color: #fff;
`;

const CateogryText = styled.p`
  font-size: 15px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const ImageBox = styled.img`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
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
  font-size: 14px;
  font-family: "Prata-Regular";
  color: #fff;
`;

const OrderDetail = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  cursor: pointer;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: #969696;
  text-align: left;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
  font-family: "Prata-Regular";
  color: #000;
  margin-top: 4px;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  flex: 1 1 200px;
  min-width: 120px;
  height: 40px;
  border: none;
  border-radius: 6px;
  background-color: #292E49;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-family: "Prata-Regular";
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
`;

const AlertImage = styled.img`
  width: 80px;
  height: 80px;
`;

const Message = styled.p`
  font-size: 20px;
  font-family: "Prata-Regular";
  margin-bottom: 20px;
  color: #d9d9d9;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const GlassCard = styled.div`
  border-radius: 16px;
  padding: 16px;
  overflow: hidden;

  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.15);

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 20px auto 28px;   
    padding: 20px 14px 12px;
  }

`;