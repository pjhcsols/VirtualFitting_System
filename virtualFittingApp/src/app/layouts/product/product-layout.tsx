import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/widgets/header";
import { BREAKPOINTS } from "@/shared"
import { Starfield } from "@/shared/components/star";

function ProductLayout() {
  return (
    <Wrapper>
      <Starfield /> 
      <Header theme="dark" /> 
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  overflow-y: auto;
  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }

`;

export { ProductLayout };
