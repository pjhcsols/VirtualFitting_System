import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { HeroSection, DescriptionSection } from "@/widgets/main";
import { useEffect, useRef, useState } from "react";

import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled from "styled-components";

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);
  const aiIntroductionRef = useRef<HTMLDivElement>(null);
  const [isDescriptionSectionVisible, setIsDescriptionSectionVisible] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const tl = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
        scrollTrigger: {
          trigger: slider,
          pin: true,
          scrub: 2,
        },
      });

      tl.to(slider, {
        yPercent: -100,
      });

      return () => {
        ScrollTrigger.killAll();
      };
    }
  }, []);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    const aiIntroElement = aiIntroductionRef.current;
    if (aiIntroElement) {
      const st = ScrollTrigger.create({
        trigger: aiIntroElement,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          console.log('AIIntroduction entered viewport');
          setIsDescriptionSectionVisible(true);
        },
        onLeaveBack: () => {
          console.log('AIIntroduction left viewport (scrolling back)');
          setIsDescriptionSectionVisible(false);
        },
      });

      return () => {
        st.kill();
      };
    }
  }, []);

  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <MainSection>
        <Article className="slider" ref={sliderRef}>
          <ModelContainer>
            <Hero>
              <HeroSection />
            </Hero>
            <AIIntroduction ref={aiIntroductionRef}>
              <DescriptionSection shouldAnimate={isDescriptionSectionVisible} />
            </AIIntroduction>
          </ModelContainer>
          <section></section>
          <section></section>
          <section></section>
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
    circle at 25% 25%,
    #292e49 0%,
    #536976 50%,
    #bbd2c5 100%
  );
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ModelContainer = styled.section`
  position: relative;
  width: 100%;
  height: 200vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Hero = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AIIntroduction = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
