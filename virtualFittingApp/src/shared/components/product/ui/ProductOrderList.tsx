import styled from "styled-components";
import type { OrderData } from "@/shared";

type OrderListProps = {
  orderData: OrderData[];
  isOrderListPage?: boolean;
};

function ProductOrderList({ orderData, isOrderListPage }: OrderListProps) {
  if (orderData.length === 0) {
    return (
      <Wrapper>
        <ItemTitle>주문 내역 조회</ItemTitle>
        <EmptyMessage>구매한 물품이 없습니다.</EmptyMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ItemContainer>
        <ItemTitle>주문 내역 조회</ItemTitle>
      </ItemContainer>
      {orderData.map((order, i) => (
        <OrderInfoContainer>
          <OrderInfoBox>
            <OrderDateText>{order.orderDate} 결제</OrderDateText>
            <OrderIDText>주문번호 {order.orderId}</OrderIDText>
            <OrderProductName>{order.productName} / {order.color} · {order.size} / {order.totalCnt}개 </OrderProductName>
            <OrderPriceText>{(order.price * order.totalCnt).toLocaleString()}원 </OrderPriceText>
          </OrderInfoBox>
        </OrderInfoContainer>
      ))}
    </Wrapper>
  );
}


const Wrapper = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ItemTitle = styled.div`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  padding-bottom: 16px;
`;

const OrderInfoContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 12px 0;
  flex-direction: row;
  align-items: flex-start;
`;

const OrderInfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OrderDateText = styled.div`
  font-size: 14px;
  font-weight: 600;
  padding: 4px 0px;
  color: black;
`

const OrderIDText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color:  black;
`
const OrderProductName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

const OrderPriceText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: black;
`

const EmptyMessage = styled.div`
  font-family: "pretendard";
  font-size: 16px;
  color: #666;
  margin-top: 16px;
`;

export { ProductOrderList };
