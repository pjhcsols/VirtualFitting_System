import styled from "styled-components";
import { Text, Title } from "../components";

function AdminProduct() {
  return (
    <Wrapper>
      <TopLayerContainer>
        <DescBox>
          <Title>Brand Product 관리</Title>
          <Text>Basilium 에 출품된 Product를 관리할 수 있습니다.</Text>
        </DescBox>
      </TopLayerContainer>
      <ContentLayerContainer></ContentLayerContainer>
    </Wrapper>
  );
}

export { AdminProduct };

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
