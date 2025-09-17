import styled from "styled-components";

import { Basilium3DLogo } from "@/shared";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { BasiliumLogoText, PrataText } from "@/shared/components/common";
import { NavLink } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const RotatingStars = () => {
    const stars = useRef<THREE.Points>(null);

    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x = stars.current.rotation.y += 0.00015;
      }
    });

    return <Stars ref={stars} />;
  };
  return (
    <Wrapper>
      <StarBackground>
        <StarContainer>
          <Canvas>
            <RotatingStars />
          </Canvas>
        </StarContainer>
        <HeaderContainer>
          <BasiliumLogoText />
        </HeaderContainer>
        <ModelContainer>
          <Basilium3DLogo />
        </ModelContainer>
        <InfoContainer>
          <PrataText size={"4rem"} $weight={700} color="#fff">
            WEAR CROWN
          </PrataText>
          <PrataText size={"1.5rem"} $weight={500} color="#fff">
            RULE YOUR STYLE
          </PrataText>
          <ButtonContainer>
            <LoginButton to={"/login"}>
              <PrataText size={"0.8rem"} $weight={500} color="#fff">
                LOGIN
              </PrataText>
            </LoginButton>
            <LoginButton to={"/store"}>
              <PrataText size={"0.8rem"} $weight={500} color="#fff">
                STORE
              </PrataText>
            </LoginButton>
          </ButtonContainer>
        </InfoContainer>
      </StarBackground>
    </Wrapper>
  );
}

export { HeroSection };

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StarBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const StarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: 0;
`;

const HeaderContainer = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height: 80px;
  padding: 0 40px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const ModelContainer = styled.div`
  width: 50vw;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  width: 50vw;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 10;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const LoginButton = styled(NavLink)`
  padding: 16px 48px;
  font-size: 18px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    box-shadow:
      0 12px 40px rgba(31, 38, 135, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
  &:after {
    transform: translateY(0);
    box-shadow:
      0 4px 16px rgba(31, 38, 135, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;