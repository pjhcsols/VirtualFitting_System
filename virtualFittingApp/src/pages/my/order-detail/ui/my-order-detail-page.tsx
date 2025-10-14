import styled from "styled-components";
import { OrderDetails } from "@/widgets/order-details";
import { BREAKPOINTS } from "@/shared";

export function MyOrderDetailPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <InnerContent>
           <h1>주문 상세 정보</h1>
          <OrderDetails />
        </InnerContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  max-width: 800px;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;
