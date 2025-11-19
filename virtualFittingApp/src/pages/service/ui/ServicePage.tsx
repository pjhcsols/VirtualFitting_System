import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled, { createGlobalStyle } from "styled-components";
import { TransparentHeader } from "@/widgets/header";
import { Starfield } from "@/shared/components/star";
import { ServiceSection } from "@/widgets/service";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared";

gsap.registerPlugin(ScrollTrigger);

function ServicePage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);
    
  useEffect(() => {
  const cursor = cursorRef.current;

  const handleMouseMove = (e: MouseEvent) => {
    gsap.to(cursor, {
      x: e.clientX - 20, 
      y: e.clientY - 20, 
      duration: 0.3, 
      ease: "power2.out",
    });
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
  }, []);


  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <Starfield theme="light"/>
      <TooltipGlobalStyles /> 
      <GlobalCursorStyle />
      <TransparentHeader 
      />
      <CustomCursor ref={cursorRef} />
      <MainSection>
        <Article className="slider" ref={sliderRef}>
          <ModelContainer>
            <Section>
              <ServiceSection />
            </Section>
          </ModelContainer>
        </Article>
        <Footer />
      </MainSection>
    </Wrapper>
  );
}

export { ServicePage };

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
  height: 180vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;

  @media (max-width: ${BREAKPOINTS.md}px) {
    height: auto;
    padding: 4rem 0;
  }
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