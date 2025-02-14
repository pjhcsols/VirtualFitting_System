import { Outlet } from "react-router-dom";
import styled from "styled-components";

function AdminSignLayout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  width: 100vw;
`;

export { AdminSignLayout };
