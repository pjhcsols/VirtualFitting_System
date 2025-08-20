import styled from "styled-components";
import { BannerCarousel, Text, Title } from "@/pages/admin/components";

function AdminBanner() {
  return (
    <Wrapper>
      <TopLayerContainer>
        <DescBox>
          <Title>Banner Manager</Title>
          <Text>스토어 배너 관리 페이지입니다.</Text>
        </DescBox>
      </TopLayerContainer>
      <ContentLayerContainer>
        <BannerCarousel />
      </ContentLayerContainer>
    </Wrapper>
  );
}

export { AdminBanner };

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

const ContentLayerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
