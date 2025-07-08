import React, { Suspense } from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { CancelContentList } from "@/pages/my/ui/CancelContentList";

function MyCancel() {
  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="취소/반품/교환 내역" />
      </HeaderWrapper>

      <ContentWrapper>
        <Suspense fallback={<div>불러오는 중...</div>}>
          <CancelContentList />
        </Suspense>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyCancel };

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;
