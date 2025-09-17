import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { MYPAGE_GRADIENT } from "@/shared/styles/Theme";
import { Header } from "@/widgets/header";
import { BREAKPOINTS } from "@/shared"

function StoreLayout() {
  return (
    <Wrapper>
      <Header theme="dark" /> 
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
  background: ${MYPAGE_GRADIENT};
`;

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

background: ${MYPAGE_GRADIENT};
  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }

`;

export { StoreLayout };
