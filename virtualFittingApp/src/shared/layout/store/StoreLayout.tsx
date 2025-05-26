import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/shared/components/header/ui/Header";

function StoreLayout() {
  return (
    <Wrapper>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #fffafa;
`;

const BREAKPOINT = {
  xlDouble: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
};

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: white;

  @media (max-width: ${BREAKPOINT.sm}px) {
    padding: 70px 16px;
  }

`;

export { StoreLayout };
