import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { HeroSection } from "@/widgets";
import styled from "styled-components";
import { useEffect, useRef } from "react";

import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      // Query sections within slider
      // const sections = gsap.utils.toArray("section", slider);
      const tl = gsap.timeline({
        defaults: {
          ease: "none",
        },
        scrollTrigger: {
          trigger: slider,
          pin: true,
          scrub: 2,
          end: () => "+=" + 600,
        },
      });

      tl.to(slider, {
        yPercent: 66,
      });

      // Cleanup ScrollTrigger on unmount
      return () => {
        // Remove all ScrollTriggers
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

  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <Article className="slider" ref={sliderRef}>
        <Hero>
          <HeroSection />
        </Hero>
        <AIIntroduction></AIIntroduction>
        <section></section>
        <section></section>
        <section></section>
      </Article>
    </Wrapper>
  );
}

export { MainPage };

const Wrapper = styled(ReactLenis)``;

const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Hero = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AIIntroduction = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
