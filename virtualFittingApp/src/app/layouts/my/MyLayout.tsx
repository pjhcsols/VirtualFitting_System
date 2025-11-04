import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared";
import { Starfield } from "@/shared/components/star";

function MyPageLayout() {
  return (
    <Wrapper>
      <Starfield /> 
      <Header theme="dark" $sticky={true} /> 
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }
`;

export { MyPageLayout };