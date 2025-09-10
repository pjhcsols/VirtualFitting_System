import { BrandProductHeader } from "@/widgets/brand-header";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

function BrandProductLayout() {
  return (
    <Wrapper>
      <BrandProductHeader />
      <Container>
        <Outlet />
      </Container>
    </Wrapper>
  );
}

export { BrandProductLayout };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const Container = styled.main`
  box-sizing: border-box;
  padding: 0rem 4rem;
  width: 100%;
`;
