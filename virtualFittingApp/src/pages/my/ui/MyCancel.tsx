import React, { Suspense} from "react";
import styled from "styled-components";
import { Header } from "@/widgets/header";
import { CancelContentList } from "@/pages/my/ui/CancelContentList";

function MyCancel() {
  return (
    <PageWrapper>
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
  flex: 1;
  min-height: auto; 
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;