import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/widgets/header";
import { Starfield } from "@/shared/components/star";

function MyPageLayout() {
  return (
    <Wrapper>
      <Starfield />
      <Header theme="dark" /> 
      <Outlet />
    </Wrapper>
  );
}

export { MyPageLayout }

const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  background: #292e49;
`;