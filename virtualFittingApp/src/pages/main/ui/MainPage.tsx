import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { HeroSection, AiServiceSection } from "@/widgets";
import { useEffect, useRef } from "react";

import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styled from "styled-components";

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);

  const RotatingStars = () => {
    const stars = useRef<THREE.Points>(null);

    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x += 0.00015;
        stars.current.rotation.y += 0.00015;
        stars.current.rotation.x = stars.current.rotation.y += 0.00015;
      }
    });

    return <Stars ref={stars} />;
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const tl = gsap.timeline({
        defaults: {
          ease: "none",
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

  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <MainSection>
        {/* <StarContainer>
          <Canvas>
            <RotatingStars />
          </Canvas>
        </StarContainer> */}
        <Article className="slider" ref={sliderRef}>
          <ModelContainer>
            <Hero>
              <HeroSection />
            </Hero>
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
  background: linear-gradient(to bottom, #292e49, #536976 50%, #bbd2c5 100%);
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

const StarContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
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
