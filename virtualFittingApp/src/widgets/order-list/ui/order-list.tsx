import styled from "styled-components";
import { useOrderList } from "../hooks/use-order-list";
import { OrderSummaryCard } from "@/entities/order/ui/order-summary-card";
import alertImg from "@/shared/assets/images/alert-fallback.png";
import { BREAKPOINTS } from "@/shared";

export function OrderList() {
  const { orders, isLoading, error } = useOrderList();

  if (isLoading) return <Wrapper><Message>주문 목록을 불러오는 중...</Message></Wrapper>;
  if (error) return <Wrapper><Message>오류가 발생했습니다.</Message></Wrapper>;

  if (orders.length === 0) {
    return (
      <Wrapper>
        <EmptyWrapper>
          <AlertImage src={alertImg} alt="알림 아이콘" />
          <Message>구매하신 상품이 없습니다.</Message>
        </EmptyWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <CardGrid>
        {orders.map((order) => (
          <OrderSummaryCard key={order.id} order={order} />
        ))}
      </CardGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 20px;  
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;             
`;

const Message = styled.p`
  font-size: 20px;
  font-family: "Prata-Regular";
  margin-bottom: 20px;
  color: #d9d9d9;
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
