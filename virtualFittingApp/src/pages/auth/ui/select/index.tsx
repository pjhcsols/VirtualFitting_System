import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled from "styled-components";
import { Starfield } from "@/shared/components/star";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";
import { NavLink } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function SignUpSelectPage() {
  const sliderRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<LenisRef>(null);

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
      <Starfield theme="light" />
      <MainSection>
        <Article className="slider" ref={sliderRef}>
          <Section>
            <div className="w-full flex justify-center items-center">
              <TitleText>BASILIUM</TitleText>
            </div>
            <CardSection>
              <GlassBoxStyled>
                <SignUpPanel to={"/signup/normal"}>
                  <ColumnTitle>일반 유저</ColumnTitle>
                  <AnimationColumnTitle>➤ 회원가입하기 </AnimationColumnTitle>
                </SignUpPanel>
              </GlassBoxStyled>
              <GlassBoxStyled>
                <SignUpPanel to={"/signup/brand"}>
                  <ColumnTitle>브랜드 유저</ColumnTitle>
                  <AnimationColumnTitle>➤ 등록하기 </AnimationColumnTitle>
                </SignUpPanel>
              </GlassBoxStyled>
            </CardSection>
          </Section>
        </Article>
        <Footer />
      </MainSection>
    </Wrapper>
  );
}

export { SignUpSelectPage };

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

const Section = styled.div`
  box-sizing: border-box;
  padding: 1rem 10rem;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;

  @media (max-width: ${BREAKPOINTS.md}px) {
    height: auto;
    padding: 4rem 0;
  }
`;

const CardSection = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5rem;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
`;

const GlassBoxStyled = styled(GlassBox)`
  flex: 1;
  padding: 2rem;
  width: 300px;
  transition: 0.2s all ease-out;

  &:hover {
    transform: translateY(-16px);
  }

  @media (max-width: 1200px) {
    width: 100%;
    max-width: 500px;
  }
  cursor: pointer;
`;

const SignUpPanel = styled(NavLink)`
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
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
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 38px;
    padding-right: 0;
    text-align: left;
    letter-spacing: -2px;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const AnimationColumnTitle = styled(ColumnTitle)`
  transition: 0.2s all ease-out;
  ${GlassBoxStyled}&:hover {
    transform: translateX(16px);
  }
`;
