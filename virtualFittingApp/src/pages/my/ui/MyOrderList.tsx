import React, { Suspense } from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { OrderListContent } from "@/pages/my/ui/OrderContentList";

function MyOrderList() {
  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="주문내역" />
      </HeaderWrapper>

      <ContentWrapper>
        <InnerContent>
          <Suspense fallback={<div>불러오는 중...</div>}>
            <OrderListContent />
          </Suspense>
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
  min-height: 100vh;
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
  flex-grow: 1;
`;

const InnerContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 30px 30px;
  box-sizing: border-box;
`;