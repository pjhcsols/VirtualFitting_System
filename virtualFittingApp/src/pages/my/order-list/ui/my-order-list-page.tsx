import styled from "styled-components";
import { OrderList } from "@/widgets/order-list";
import { BREAKPOINTS } from "@/shared";

export function MyOrderListPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
          <OrderList />
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 70px 30px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;