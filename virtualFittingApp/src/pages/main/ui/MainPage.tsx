import * as S from "@/pages/main/ui/css/MainPage.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { HeroSection } from "@/widgets";
import { useEffect, useRef } from "react";

import { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

function MainPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);

  const RotatingStars = () => {
    const stars = useRef(null);

    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x = stars.current.rotation.y += 0.00015;
      }
    });

    return <Stars ref={stars} />;
  };

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
        },
      });

      tl.to(slider, {
        yPercent: -100,
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
    <S.Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <S.MainSection>
        <S.StarContainer>
          <Canvas>
            <RotatingStars />
          </Canvas>
        </S.StarContainer>
        <S.Article className="slider" ref={sliderRef}>
          <S.ModelContainer>
            <S.Hero>
              <HeroSection />
            </S.Hero>
            <S.AIIntroduction></S.AIIntroduction>
          </S.ModelContainer>
          <section></section>
          <section></section>
          <section></section>
        </S.Article>
      </S.MainSection>
    </S.Wrapper>
  );
}

export { MainPage };
