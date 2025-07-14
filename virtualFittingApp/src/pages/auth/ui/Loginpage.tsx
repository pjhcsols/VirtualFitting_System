import { Basilium3DLogo } from "@/shared";
import { LoginForm } from "@/widgets";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import styled from "styled-components";

function Loginpage() {
  const RotatingStars = () => {
    const stars = useRef(null);

    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x = stars.current.rotation.y += 0.00015;
      }
    });

    return <Stars ref={stars} />;
  };
  return (
    <Wrapper>
      <LeftContainer>
        <Canvas>
          <RotatingStars />
        </Canvas>
        <ModelContainer>
          <Basilium3DLogo />
        </ModelContainer>
      </LeftContainer>
      <RightContainer>
        <LoginForm />
      </RightContainer>
    </Wrapper>
  );
}

export { Loginpage };

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
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
  background-color: #fffafa;
`;

const ModelContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
