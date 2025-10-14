import styled from "styled-components";
import { OrderList } from "@/widgets/order-list";

export function MyOrderListPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        {/* <InnerContent>
          <Suspense fallback={<div>주문 목록을 불러오는 중...</div>}> */}
            <OrderList />
          {/* </Suspense>
        </InnerContent> */}
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
  flex-grow: 1;
`;

// const InnerContent = styled.div`
//   width: 100%;
//   max-width: 800px;
//   padding: 30px 30px;
//   box-sizing: border-box;

//   @media (max-width: ${BREAKPOINTS.md}px) {
//     padding: 20px 16px;
//     max-width: 100%;
//   }
// `;
