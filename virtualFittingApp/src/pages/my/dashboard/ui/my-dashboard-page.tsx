import styled from 'styled-components';
import { MyDashboard } from '@/widgets/my-dashboard';
import { BREAKPOINTS } from '@/shared';

export function MyDashboardPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <MyDashboard />
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 70px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: 20px;
  margin-bottom: 100px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 10px;
    max-width: 100%;
  }
`;
