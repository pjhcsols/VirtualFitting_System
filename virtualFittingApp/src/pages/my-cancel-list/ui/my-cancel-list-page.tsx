import styled from 'styled-components';
import { StarryBackground } from '@/widgets/starry-background';
import { CancelList } from "@/widgets/cancle-list";

export function MyCancelListPage() {
  return (
    <PageWrapper>
      <StarryBackground />
      <ContentWrapper>
        <CancelList />
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

const ContentWrapper = styled.div`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;



