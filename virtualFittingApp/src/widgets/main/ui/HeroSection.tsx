import styled, { keyframes } from "styled-components";
import { Basilium3DLogoMain } from "@/shared";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useNavigate } from "react-router-dom";
import { GlassButton } from "@/shared/components/glass-button";
import { Starfield } from "@/shared/components/star";
import { useRef, useEffect } from "react";
import { rawSvgContent } from "../model/constants";

gsap.registerPlugin(ScrollTrigger);

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

function HeroSection() {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);
  const buttonRef = useRef(null);
  const scrollProgress = useRef({ value: 0 });

  const handleScheduleClick = () => {
    navigate('/login');
  };

  const handleStoreClick = () => {
    navigate('/products');
  };


  useEffect(() => {
    gsap.set([titleRef.current, textRef1.current, textRef2.current, buttonRef.current], { opacity: 0, y: 30 });
    
    const tl = gsap.timeline({ defaults: { duration: 1.8, ease: "power3.out" } });
    tl.fromTo(
      titleRef.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1 },
      0.5
    ) 

    .fromTo(
      textRef1.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1 },
      "-=1.2"
    ) 

    .fromTo(
      textRef2.current, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1 },
      "-=1.4"
    ) 
    
    .fromTo(
      buttonRef.current, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1 },
      "-=1.2"
    );

    gsap.to(scrollProgress.current, {
      value: 1, 
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  return (
    <Wrapper>
      <Starfield theme="light"/>
      <LogoText>Basilium</LogoText>
        <ModelContainer>
          <Basilium3DLogoMain scrollProgress={scrollProgress} />
        </ModelContainer>
        <BackContainer>
          <ContentContainer>
            <TitleText ref={titleRef}>Virtual Fitting System</TitleText> 
            <ContentText ref={textRef1}>바실리움의 다양한 IT 솔루션을 만나보세요.</ContentText>
            <ContentText ref={textRef2}>지금, 비즈니스의 성장을 시작하세요.</ContentText>
            <ButtonContainer ref={buttonRef}>
              <GlassButton onClick={handleScheduleClick} size='large'>
              일정상담
              </GlassButton>
              <GlassButton onClick={handleStoreClick} size='large'>
              스토어
              </GlassButton>
            </ButtonContainer>
          </ContentContainer>
        </BackContainer>
        <ScrollArrow dangerouslySetInnerHTML={{ __html: rawSvgContent }} />
    </Wrapper>
  );
}

export { HeroSection };

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoText = styled.span`
  font-family: "Prata-Regular";
  font-size: 24px;
  color: white;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  padding: 16px 40px;
  display: flex;
`;

const ModelContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  margin-left: 64px;
`;

const BackContainer = styled.div`
  flex: 2;
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-end;
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-end;
  z-index: 2;
`;

const TitleText = styled.div`
  font-family: "Prata-Regular";
  font-size: 96px;
  font-weight: 600;
  text-align: right;
  letter-spacing: -4px;
  padding-right: 84px;
  padding-bottom: 24px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ContentText = styled.div`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  text-align: right;
  letter-spacing: -1px;
  padding-right: 84px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  padding-top: 32px;
  padding-right: 90px;
  gap: 16px;
  width: 100%; 
`;

const ScrollArrow = styled.div`
  position: absolute;
  bottom: 140px;
  z-index: 10;
  animation: ${bounce} 2s infinite;
  
  color: #E9FAFF; 

  svg {
    width: 50px; 
    height: 100px;
    fill: none;
    stroke: currentColor;
    stroke-width: 20;
    stroke-linecap: round;
    stroke-linejoin: round;
    display: block;
    vertical-align: middle;
  }
`;