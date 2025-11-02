import { Outlet } from "react-router-dom";
import styled from "styled-components";

function MainLayout() {
  return (
    <Wrapper>
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
`;
