import React, { Suspense} from "react";
import styled from "styled-components";
import { ReviewContentList } from "@/pages/my/ui/ReviewContentList";

function MyReview() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <Suspense fallback={<div>불러오는 중...</div>}>
          <ReviewContentList />
        </Suspense>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyReview };

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