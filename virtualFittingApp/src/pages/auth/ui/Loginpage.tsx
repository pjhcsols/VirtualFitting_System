import { Basilium3DLogo } from "@/shared";
import { LoginForm } from "@/widgets";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import styled from "styled-components";
import * as THREE from "three";

function Loginpage() {
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
      <InfoContainer>
        <StarBackground>
          <Canvas>
            <RotatingStars />
          </Canvas>
        </StarBackground>
        <LeftContainer>
          <ModelContainer>
            <Basilium3DLogo />
          </ModelContainer>
        </LeftContainer>
        <RightContainer>
          <LoginForm />
        </RightContainer>
      </InfoContainer>
    </Wrapper>
  );
}

export { Loginpage };

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const StarBackground = styled.div`
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
  background: radial-gradient(
    circle at 30% 30%,
    #292e49 0%,
    #536976 50%,
    #bbd2c5 100%
  );
`;

const InfoContainer = styled.div`
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

const LeftContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const RightContainer = styled.div`
  box-sizing: border-box;
  padding: 5rem;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: cneter;
`;

const ModelContainer = styled.div`
  position: relative;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
