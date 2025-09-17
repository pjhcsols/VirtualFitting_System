import styled from 'styled-components';
import { Suspense } from 'react';
import { StarryBackground } from '@/widgets/starry-background';
import { ReviewList } from '@/widgets/review-list';

export function MyReviewListPage() {
  return (
    <PageWrapper>
      <StarryBackground />
      <HeaderWrapper>
      </HeaderWrapper>
      <ContentWrapper>
        <Suspense fallback={<div>불러오는 중...</div>}>
          <ReviewList />
        </Suspense>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;