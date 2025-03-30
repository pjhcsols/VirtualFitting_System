import { useEffect } from "react";
import styled from "styled-components";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function LandingHeader({ className }: { className?: string }) {
  useEffect(() => {
    gsap.fromTo(
      ".logo-texture",
      {
        yPercent: 100,
        opacity: 0,
      },
      {
        delay: 3,
        yPercent: 0,
        stagger: 0.1,
        duration: 1,
        opacity: 1,
        ease: "power4.out",
      },
    );
    // gsap.to(".logo-texture", {
    //   scrollTrigger: {
    //     trigger: ".header-container",
    //     start: "end start",
    //     scrub: 1,
    //     markers: true,
    //     toggleActions: "restart",
    //   },
    //   yPercent: 100,
    //   opacity: 0,
    //   duration: 1,
    //   ease: "power4.out",
    // });
  }, []);

  return (
    <Wrapper className={className}>
      <HeaderContainer>
        <HeaderLogo className="logo-texture">T</HeaderLogo>
        <HeaderLogo className="logo-texture">h</HeaderLogo>
        <HeaderLogo className="logo-texture">e</HeaderLogo>
        <HeaderLogo className="logo-texture">&nbsp;</HeaderLogo>
        <HeaderLogo className="logo-texture">P</HeaderLogo>
        <HeaderLogo className="logo-texture">r</HeaderLogo>
        <HeaderLogo className="logo-texture">i</HeaderLogo>
        <HeaderLogo className="logo-texture">m</HeaderLogo>
        <HeaderLogo className="logo-texture">i</HeaderLogo>
        <HeaderLogo className="logo-texture">u</HeaderLogo>
        <HeaderLogo className="logo-texture">m</HeaderLogo>
        <HeaderLogo className="logo-texture">&nbsp;</HeaderLogo>
        <HeaderLogo className="logo-texture">B</HeaderLogo>
        <HeaderLogo className="logo-texture">r</HeaderLogo>
        <HeaderLogo className="logo-texture">a</HeaderLogo>
        <HeaderLogo className="logo-texture">n</HeaderLogo>
        <HeaderLogo className="logo-texture">d</HeaderLogo>
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
