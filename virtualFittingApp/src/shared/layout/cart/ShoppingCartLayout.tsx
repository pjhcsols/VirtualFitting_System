import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/shared";
import { BREAKPOINTS } from "@/shared";

function ShoppingCartLayout() {
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

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: white;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }

`;

export { ShoppingCartLayout };
