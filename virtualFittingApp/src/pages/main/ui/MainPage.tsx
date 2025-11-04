import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { HeroSection, DescriptionSection, SolutionSection, VirtualFittingSection } from "@/widgets/main";
import { useEffect, useRef } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled from "styled-components";
import { TransparentHeader } from "@/widgets/header";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const virtualFittingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
      ScrollTrigger.refresh(); 
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current && lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(ref.current, { offset: -64, duration: 1.2 });
    }
  };

  const handleDescriptionScroll = () => scrollToSection(descriptionRef);
  const handleVirtualFittingScroll = () => scrollToSection(virtualFittingRef);
  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <TransparentHeader 
        onDescriptionScroll={handleDescriptionScroll}
        onVirtualFittingScroll={handleVirtualFittingScroll}
      />
      <MainSection>
        <Article className="slider" ref={sliderRef}>
          <ModelContainer>
            <Section>
              <HeroSection />
            </Section>
            <Section ref={descriptionRef}>
              <DescriptionSection />
            </Section>
            <Section>
              <SolutionSection />
            </Section>
            <Section>
              <VirtualFittingSection />
            </Section>
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
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
