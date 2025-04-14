import React, {useEffect, useState } from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "../types/order";
import { OrderInfo } from "../api/order.action";
import { formatDate } from "@/shared/components/product/utils/date.util";

function MyOrderList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await OrderInfo();
      setOrders(data);
    };
    load();
  }, []);

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="주문내역" />
      </HeaderWrapper>

      <ContentWrapper>
        <InnerContent>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <DateText>{formatDate(order.date)}</DateText>

              <OrderCard>
                <ImageBox /> {/* 실제 이미지 url 적용할 경우 src 속성 추가 */}

                <RightSection>
                  <TitleLine>
                    <Brand>{order.brand}</Brand>
                    <OrderDetail onClick={() => navigate(`/myPage/order/${order.id}`)}>
                      주문 상세
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
                <ActionButton>리뷰 작성</ActionButton>
                <ActionButton>환불 신청</ActionButton>
              </ButtonWrapper>

              <Divider />
            </React.Fragment>
          ))}
        </InnerContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyOrderList };

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InnerContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 30px 30px;
  box-sizing: border-box;
`;

const DateText = styled.p`
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 12px;
  margin-right: 500px;
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 550px;
`;

const ImageBox = styled.div`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
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
`;

const OrderDetail = styled.div`
  font-size: 12px;
  color: #888;
  text-decoration: underline;
  cursor: pointer;  
  margin-right: 8px;
`;

const ProductName = styled.div`
  font-size: 14px;
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  color: rgb(150, 150, 150);
  text-align: left;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-top: 4px;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  width: 300px;
  height: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 540px;
`;