import { MainNavigator } from "@/pages/main/components";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

function MainLayout() {
  return (
    <Wrapper>
      <MainNavigator />
      <Outlet />
    </Wrapper>
  );
}

export { MainLayout };

const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #fffafa;
`;
