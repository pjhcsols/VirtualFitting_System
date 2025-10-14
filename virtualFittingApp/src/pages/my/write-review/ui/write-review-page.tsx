import styled from 'styled-components';
import { ReviewForm } from '@/widgets/review-form';
import { BREAKPOINTS } from '@/shared';

export function WriteReviewPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <ReviewForm />
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
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  padding: 24px 20px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-bottom: 70px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
    padding: 88px 16px 20px;
  }
`;

