import { useEffect, useRef } from "react";

import * as S from "@/pages/brand/ui/css/BrandPage.css";
import { BasiliumNoAnimationLogo, PopLogo } from "@/shared";
import { BrandLandingHeader } from "./BrandLandingHeader";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function BrandPage() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.fromTo(
      ".carpet",
      {
        y: 200,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: "power4.out",
      },
    );
    gsap.fromTo(
      ".fitting-title",
      {
        y: 50,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".fitting-title",
          start: "top center",
          markers: true,
        },
        stagger: 0.25,
        y: 0,
        opacity: 1,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      ".fitting-text",
      {
        y: 50,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".fitting-text",
          start: "top center",
          markers: true,
        },
        stagger: 0.25,
        y: 0,
        opacity: 1,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      ".interface-title",
      {
        y: 50,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".interface-title",
          start: "top center",
          markers: true,
        },
        stagger: 0.25,
        y: 0,
        opacity: 1,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      ".interface-text",
      {
        y: 50,
        opacity: 0,
      },
      {
        scrollTrigger: {
          trigger: ".interface-text",
          start: "top center",
          markers: true,
        },
        stagger: 0.25,
        y: 0,
        opacity: 1,
        ease: "power3.out",
      },
    );
  }, []);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <S.LenisWrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <S.Wrapper>
        <BrandLandingHeader />
        <S.Container className="container">
          {/* Hero Section */}
          <S.HeroContainer>
            <S.TitleContainer>
              <S.Title>AI ShoppingMall Platform</S.Title>
              <S.Title>with. BASILIUM</S.Title>
            </S.TitleContainer>
            <S.Carpet className="carpet">
              <PopLogo />
            </S.Carpet>
          </S.HeroContainer>

          {/* AI Fitting System Description Section */}
          <S.DescSection className="fitting-sys">
            <S.DescTitle className="fitting-title">
              AI Fitting System
            </S.DescTitle>
            <S.ContentContainer>
              <S.AIWearingContainer></S.AIWearingContainer>
              <S.TextureContainer>
                <S.DescText className="fitting-text">
                  바실리움 입점 브랜드
                </S.DescText>
                <S.DescText className="fitting-text">
                  상품들에 AI 시착 기능 구비
                </S.DescText>
              </S.TextureContainer>
            </S.ContentContainer>
          </S.DescSection>

          {/* Brand User Interface Description Section */}
          <S.InterfaceDescSection className="interface-sys">
            <S.DescTitle className="interface-title">
              Brand Interface
            </S.DescTitle>
            <S.ContentContainer>
              <S.AIWearingContainer></S.AIWearingContainer>
              <S.TextureContainer>
                <S.DescText className="interface-text">
                  간편한 상품 프로세스로
                </S.DescText>
                <S.DescText className="interface-text">
                  필요한 정보들을 한번에 확인
                </S.DescText>
              </S.TextureContainer>
            </S.ContentContainer>
          </S.InterfaceDescSection>

          {/* Basilium Description Section */}
          <S.BasiliumDescSection>
            <S.BasiliumLogoContainer>
              <BasiliumNoAnimationLogo />
            </S.BasiliumLogoContainer>
            <S.BasiliumTextureContainer>
              <S.BasiliumLogoText>Basilium</S.BasiliumLogoText>
            </S.BasiliumTextureContainer>
          </S.BasiliumDescSection>
        </S.Container>
      </S.Wrapper>
    </S.LenisWrapper>
  );
}

export { BrandPage };
