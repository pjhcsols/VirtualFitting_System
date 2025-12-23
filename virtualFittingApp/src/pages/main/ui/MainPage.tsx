import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import {
  CommerceTextSection,
  HeroSection,
  ServiceTextSection,
  AITextSection,
  SolutionSection,
  VirtualFittingSection,
  AboutSection,
} from "@/widgets/main";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled, { createGlobalStyle } from "styled-components";
import { TransparentHeader } from "@/widgets/header";
import { BREAKPOINTS } from "@/shared/constants";
import awardAiImage from "@/assets/awards/award-ai.png";
import awardWebImage from "@/assets/awards/award-web.png";

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const virtualFittingRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const openAwardPopup = (imageSrc: string, name: string) => {
      const width = 477;
      const height = 490;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
      
      const popupWindow = window.open('', name, features);
      if (popupWindow) {
        popupWindow.document.write(`
          <html>
          <head>
            <title>${name}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${imageSrc}" alt="${name}" />
          </body>
          </html>
        `);
        popupWindow.document.close(); 
        return popupWindow;
      }
      return null;
    };

    let aiPopup: Window | null = null;
    let webPopup: Window | null = null;

    aiPopup = openAwardPopup(awardAiImage, '2025 AI어워드코리아 AI서비스분야 대상');

    const timer = setTimeout(() => {
      if (aiPopup && !aiPopup.closed) {
      }
      webPopup = openAwardPopup(awardWebImage, '2025 웹어워드코리아 IT솔루션분야 대상');
    }, 3000); 

    return () => {
      clearTimeout(timer);
      if (aiPopup && !aiPopup.closed) aiPopup.close();
      if (webPopup && !webPopup.closed) webPopup.close();
    };
  }, []); 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  const scrollToVirtualFitting = useCallback(() => {
    if (lenisRef.current?.lenis && virtualFittingRef.current) {
      lenisRef.current.lenis.scrollTo(virtualFittingRef.current, {
        offset: -50,
        duration: 1.5,
      });
    }
  }, []);

  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <TooltipGlobalStyles />
      {!isMobile && <GlobalCursorStyle />}
      <TransparentHeader />
      {!isMobile && <CustomCursor ref={cursorRef} />}
      <MainSection>
        <Article className="slider" ref={sliderRef}>
          <ModelContainer>
            <Section>
              <HeroSection onScrollToVirtualFitting={scrollToVirtualFitting} />
            </Section>

            <Section>
              <AboutSection />
            </Section>

            <TextSection>
              <ServiceTextSection />
            </TextSection>

            <TextSection>
              <AITextSection />
            </TextSection>
            <TextSection>
              <CommerceTextSection />
            </TextSection>
            <Section>
              <SolutionSection />
            </Section>
            <SectionEmptyMedium></SectionEmptyMedium>
            <SaaSSection ref={virtualFittingRef}>
              <VirtualFittingSection />
            </SaaSSection>
            <SectionEmptyLarge></SectionEmptyLarge>
          </ModelContainer>
        </Article>
      </MainSection>
    </Wrapper>
  );
}

export { MainPage };

const Wrapper = styled(ReactLenis)``;
const MainSection = styled.section`
  box-sizing: border-box;
  width: 100%;
  transition: 0.3s padding ease-out;
  background: radial-gradient(
    circle at 15% 25%,
    #292e49 0%,
    #536976 60%,
    #bbd2c5 100%
  );
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
`;

const Article = styled.article`
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ModelContainer = styled.section`
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Section = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextSection = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    min-height: 100vh;
  }
`;

const SaaSSection = styled.div`
  width: 100%;
  min-height: 180vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SectionEmptyMedium = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    height: 400px;
  }
`;

const SectionEmptyLarge = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TooltipGlobalStyles = createGlobalStyle`
  .basil-tooltip {
    z-index: 100;
    font-size: 18px;
    background: rgba(255,255,255,0.14) !important;
    color: rgba(255,255,255,0.95) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.35) !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25);
    border-radius: 14px !important;
    padding: 16px 18px !important;
    max-width: 260px;
    line-height: 1.55; font-weight: 500; letter-spacing: .2px;
  }
`;

const CustomCursor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  // filter: blur(15px);
  pointer-events: none;
  z-index: 99999;
`;

const GlobalCursorStyle = createGlobalStyle`
  body {
    cursor: none;
  }
`;
