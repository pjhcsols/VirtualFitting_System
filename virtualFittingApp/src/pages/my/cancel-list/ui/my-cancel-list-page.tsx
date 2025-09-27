import styled from 'styled-components';
import { CancelList } from "@/widgets/cancel-list";

export function MyCancelListPage() {
  return (
    <PageWrapper>
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



