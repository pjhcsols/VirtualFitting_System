import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { TransparentHeader } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared";
import { Starfield } from "@/shared/components/star";

function CartLayout() {
  return (
    <Wrapper>
      <Starfield />
      <TransparentHeader />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 70px 50px;
  width: 100%;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  align-items: flex-start;
  background: white;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }

`;

export { CartLayout };
