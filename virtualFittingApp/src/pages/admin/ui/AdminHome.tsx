import styled from "styled-components";
import { Text, Title } from "@/pages/admin/components";

function AdminHome() {
  return (
    <Wrapper>
      <TopLayerContainer>
        <DescBox>
          <Title>HOME</Title>
          <Text>Basilium 어드민페이지입니다.</Text>
        </DescBox>
      </TopLayerContainer>
      <ContentLayerContainer>
        <ProfitCard></ProfitCard>
        <UserInfoCard></UserInfoCard>
        <NotCompleteWorkCard></NotCompleteWorkCard>
      </ContentLayerContainer>
    </Wrapper>
  );
}

export { AdminHome };

const Wrapper = styled.main`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const TopLayerContainer = styled.section`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const DescBox = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ContentLayerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const DefaultCard = styled.div`
  min-width: 18rem;
  min-height: 12rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  gap: 0.5rem;
  transition: 0.2s all ease;
  border-radius: 1rem;
  background-color: #f5f6f8;
`;

const ProfitCard = styled(DefaultCard)`
  &:hover {
    background-color: aliceblue;
  }
`;

const UserInfoCard = styled(DefaultCard)`
  &:hover {
    background-color: aliceblue;
  }
`;

const NotCompleteWorkCard = styled(DefaultCard)`
  &:hover {
    background-color: aliceblue;
  }
`;
