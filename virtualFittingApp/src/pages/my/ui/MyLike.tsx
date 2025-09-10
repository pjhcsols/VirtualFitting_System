import React, { Suspense} from "react";
import styled from "styled-components";
import { LikeContentList } from "@/pages/my/ui/LikeContentList";
import { BREAKPOINTS } from "@/shared";

function MyLike() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <InnerContent>
          <Suspense fallback={<div>불러오는 중...</div>}>
            <LikeContentList />
          </Suspense>
        </InnerContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyLike };

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