import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import ReactLenis, { type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import styled from "styled-components";
import { Starfield } from "@/shared/components/star";
import { TransparentHeader } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { BREAKPOINTS } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";
import { NavLink } from "react-router-dom";
import { ICON_PERSON, ICON_STORE } from "@/shared";

gsap.registerPlugin(ScrollTrigger);

function SignUpSelectPage() {
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
      <TransparentHeader />
      <MainSection>
        <Section>
          <div className="w-full flex justify-center items-center">
            <TitleText>회원 유형 선택</TitleText>
          </div>
          <CardSection>
            <GlassBoxStyled>
              <SignUpPanel to={"/signup/normal"}>
                <StyledIcon>
                  <img src={ICON_PERSON} alt="일반회원" />
                </StyledIcon>
                <ColumnTitle>일반회원</ColumnTitle>
                <Description>{`개인 사용자분들을 위한\n기본 AI 착용·쇼핑 기능이 제공됩니다.`}</Description>
              </SignUpPanel>
              <SignUpPanel to={"/signup/brand"}>
                <StyledIcon>
                  <img src={ICON_STORE} alt="브랜드회원" />
                </StyledIcon>
                <ColumnTitle>브랜드회원</ColumnTitle>
                <Description>{`브랜드·셀러를 위한\n제품·고객 관리 기능이 제공됩니다.`}</Description>
              </SignUpPanel>
            </GlassBoxStyled>
          </CardSection>
        </Section>
        <Footer />
      </MainSection>
    </Wrapper>
  );
}

export { SignUpSelectPage };

const Wrapper = styled(ReactLenis)``;
const MainSection = styled.section`
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  transition: 0.3s padding ease-out;
  background: radial-gradient(
    circle at 15% 25%,
    #292e49 0%,
    #536976 60%,
    #bbd2c5 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
  text-align: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 2rem 1rem;
  }
`;

const Section = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex: 1; /* Add this line */
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    height: auto;
    padding: 4rem 0;
  }
`;

const TitleText = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  padding: 5rem;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 36px;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const CardSection = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
`;

const GlassBoxStyled = styled(GlassBox)`
  width: 900px;
  height: 400px;
  max-width: 90%;
  padding: 3rem 0rem;
  display: flex;
  justify-content: space-around;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 10%; 
    height: 80%; 
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-flow: column nowrap;
    align-items: center;
    height: auto; 
    gap: 4rem;

    &::after {
      top: 50%;
      height: 1px;
      left: 10%;
      width: 80%;
      transform: translateY(-50%);
    }
  }
  cursor: default;
`;

const StyledIcon = styled.div`
  margin-top: 1rem;
  transition: 0.3s transform ease-out;
  width: 8rem;
  height: 8rem;

  & img {
    width: 100%;           
    height: 100%;
    opacity: 0.95;
    transition: transform .18s ease, opacity .18s ease;
  }
`;

const SignUpPanel = styled(NavLink)`
  flex: 1;
  padding: 0 1rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.1);

    ${StyledIcon} img {
      transform: scale(1.1);
      opacity: 1;
    }
  }
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 3rem;
  color: white;
  white-space: pre-line;
`;
