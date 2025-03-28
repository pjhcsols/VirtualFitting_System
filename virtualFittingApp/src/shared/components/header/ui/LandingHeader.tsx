import gsap from "gsap";
import { useEffect } from "react";
import styled from "styled-components";

function LandingHeader() {
  useEffect(() => {
    gsap.fromTo(
      ".logo-texture",
      {
        yPercent: 100,
        opacity: 0,
      },
      {
        yPercent: 0,
        stagger: 0.1,
        duration: 1,
        opacity: 1,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <Wrapper>
      <HeaderContainer>
        <HeaderLogo className="logo-texture">B</HeaderLogo>
        <HeaderLogo className="logo-texture">A</HeaderLogo>
        <HeaderLogo className="logo-texture">S</HeaderLogo>
        <HeaderLogo className="logo-texture">I</HeaderLogo>
        <HeaderLogo className="logo-texture">L</HeaderLogo>
        <HeaderLogo className="logo-texture">I</HeaderLogo>
        <HeaderLogo className="logo-texture">U</HeaderLogo>
        <HeaderLogo className="logo-texture">M</HeaderLogo>
      </HeaderContainer>
    </Wrapper>
  );
}

export { LandingHeader };

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  z-index: 50;
  transition: 0.8s all ease-out;
`;

const HeaderContainer = styled.nav`
  padding: 8px 240px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderLogo = styled.span`
  font-family: "Prata-Regular";
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;
