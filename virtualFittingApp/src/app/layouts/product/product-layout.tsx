import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Footer } from "@/widgets/footer";
import { Starfield } from "@/shared/components/star";
import { TransparentHeader } from "@/widgets/header";

function ProductLayout() {
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
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export { ProductLayout };
