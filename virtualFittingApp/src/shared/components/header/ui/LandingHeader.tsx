import { useScrollDetector } from "@/shared/hooks";
import styled from "styled-components";

function LandingHeader() {
  const isScroll = useScrollDetector();
  return (
    <Wrapper scrolled={isScroll}>
      <HeaderContainer></HeaderContainer>
    </Wrapper>
  );
}

export { LandingHeader };

const Wrapper = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  height: ${(props) => (props.scrolled ? "100px" : "120px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.scrolled ? "#141E30" : "transparent")};
  z-index: 50;
  transition: 0.3s all ease-out;
`;

const HeaderContainer = styled.nav`
  padding: 8px 240px;
  width: 100%;
  height: 100%;
  display: flex;
`;
