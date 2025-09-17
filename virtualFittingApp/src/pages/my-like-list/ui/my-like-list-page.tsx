import styled from 'styled-components';
import { Suspense } from 'react';
import { StarryBackground } from '@/widgets/starry-background';
import { LikeList } from "@/widgets/like-list";
import { BREAKPOINTS } from '@/shared';

export function MyLikeListPage() {
  return (
    <PageWrapper>
      <StarryBackground />
      <HeaderWrapper>
      </HeaderWrapper>
      <ContentWrapper>
        <InnerContent>
          <Suspense fallback={<div>불러오는 중...</div>}>
            <LikeList />
          </Suspense>
        </InnerContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
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