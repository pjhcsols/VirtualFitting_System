import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared"
import { Starfield } from "@/shared/components/star";

function PaymentLayout() {
  return (
    <Wrapper>
      <Starfield />
      <Header theme="dark"/>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ContentWrapper = styled.article`
  box-sizing: border-box;
  padding: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: white;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 70px 16px;
  }

`;

export { PaymentLayout };
