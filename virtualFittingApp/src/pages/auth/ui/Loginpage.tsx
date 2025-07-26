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
      <StarBackground>
        <Canvas>
          <RotatingStars />
        </Canvas>
      </StarBackground>
    </Wrapper>
  );
}

export { Loginpage };

const Wrapper = styled.div`
  position: relative;
  width: 100%;
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
`;

const LeftContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ModelContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
