import { BrandHeader } from "@/shared/components";
import { Outlet } from "react-router-dom";
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
  background-color: #fffafa;
`;

const Container = styled.div`
  box-sizing: border-box;
  padding: 0 140px;
  width: 100%;
  min-height: 100vh;
  transition: 0.3s padding ease-out;
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
