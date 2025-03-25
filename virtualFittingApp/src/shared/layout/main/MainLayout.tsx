import { Outlet } from "react-router-dom";
import styled from "styled-components";

import { LandingHeader } from "@/shared/components";

function MainLayout() {
  return (
    <Wrapper>
      <LandingHeader />
      <Container>
        <Outlet />
      </Container>
    </Wrapper>
  );
}

export { MainLayout };

const Wrapper = styled.main`
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #fffafa;
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 0 140px;
  width: 100%;
  height: 600vh;
  transition: 0.3s padding ease-out;
  background: linear-gradient(to bottom, #292e49, #536976 50%, #bbd2c5 100%);
  @media (max-width: 1024px) {
    padding: 0 100px;
  }
  @media (max-width: 748px) {
    padding: 0 80px;
  }
  @media (max-width: 688px) {
    padding: 0 40px;
  }
`;
