import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../components/header/ui/Header";

function UserLayout() {
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
  padding: 10px 140px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export { UserLayout };
