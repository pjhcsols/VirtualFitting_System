import React, { Suspense } from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { LikeContentList } from "@/pages/my/ui/LikeContentList";

function MyLike() {
  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="좋아요" />
      </HeaderWrapper>

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
  background: #fff;
  height: 100vh;
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
`;

const InnerContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 30px 30px;
  box-sizing: border-box;
`;