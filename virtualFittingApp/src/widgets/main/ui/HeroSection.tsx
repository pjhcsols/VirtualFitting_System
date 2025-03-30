import { useEffect } from "react";
import styled from "styled-components";

import { Basilium3DLogo } from "@/shared";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  useEffect(() => {
    const tl = gsap.timeline({});
    tl.fromTo(
      ".main-title",
      {
        yPercent: -100,
        opacity: 0,
      },
      {
        delay: 3,
        yPercent: 0,
        duration: 2,
        opacity: 1,
        ease: "power4.out",
      },
    );
    tl.fromTo(
      ".caption-text",
      {
        yPercent: -100,
        opacity: 0,
      },
      {
        delay: 1,
        yPercent: 0,
        duration: 2,
        opacity: 1,
        stagger: 0.25,
        ease: "power4.out",
      },
    );
  }, []);

  return (
    <Wrapper>
      <TextContainer>
        <BasiliumTitle id="main1" className="main-title">
          BASI
        </BasiliumTitle>
        <BasiliumTitle id="main2" className="main-title">
          LIUM
        </BasiliumTitle>
      </TextContainer>
      <CaptionContainer className="caption-container">
        <MainText className="caption-text">The King and Queen</MainText>
        <MainText className="caption-text">Casual & Street Brand</MainText>
      </CaptionContainer>
      <ModelingContainer className="3D-model">
        <Basilium3DLogo />
      </ModelingContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CaptionContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 60vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .caption-text {
    font-family: "Prata-Regular";
    font-size: "2rem";
    font-weight: 600;
    color: white;
    @media (max-width: 1440px) {
      font-size: 1.5rem;
    }
    @media (max-width: 1024px) {
      font-size: 1.25rem;
    }
    @media (max-width: 768px) {
      font-size: 1rem;
    }
    @media (max-width: 688px) {
      font-size: 0.8rem;
    }
  }
`;

const MainText = styled.span`
  font-family: "Prata-Regular";
  font-weight: 500;
  color: white;
`;

const TextContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14rem;
`;

const BasiliumTitle = styled(MainText)<{ size?: string }>`
  font-size: ${(props) => props.size ?? "4.5rem"};
  font-weight: 600;
  @media (max-width: 1440px) {
    font-size: 2.5rem;
  }
  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

/*
 * 3D Modeling Section ( Right Side on Hero)
 */

const ModelingContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export { HeroSection };
