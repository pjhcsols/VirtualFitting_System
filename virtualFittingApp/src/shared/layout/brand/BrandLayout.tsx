import { Outlet } from "react-router-dom";

import { BrandHeader } from "@/shared/components";
import styled from "styled-components";

function BrandLayout() {
  return (
    <Wrapper>
      <BrandHeader />
      <Container>
        <Outlet />
      </Container>
    </Wrapper>
  );
}

export { BrandLayout };

const Wrapper = styled.main`
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  background-color: #fffafa;
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 3rem 5.5rem;
  width: 100%;
  min-height: 100vh;
  transition: 0.3s padding ease-out;
  @media (max-width: 1024px) {
    padding: 2rem 4rem;
  }
  @media (max-width: 748px) {
    padding: 1.25rem 3rem;
  }
  @media (max-width: 688px) {
    padding: 1rem 1.5rem;
  }
`;
