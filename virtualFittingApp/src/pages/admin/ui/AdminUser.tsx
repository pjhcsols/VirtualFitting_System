import styled from "styled-components";
import { Text, Title } from "../components";

function AdminUser() {
  return (
    <Wrapper>
      <TopLayerContainer>
        <DescBox>
          <Title>Brand User 관리</Title>
          <Text>Basilium 에 가입된 User를 관리할 수 있습니다.</Text>
        </DescBox>
      </TopLayerContainer>
      <ContentLayerContainer></ContentLayerContainer>
    </Wrapper>
  );
}

export { AdminUser };

const Wrapper = styled.main`
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

const ContentLayerContainer = styled.section`
  width: 100%;
`;
