import { memo, useRef } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

interface StarfieldProps {
  theme?: 'light' | 'dark';
}

function RotatingStars() {
  const stars = useRef<THREE.Points>(null);
  useFrame(() => {
    if (stars.current) {
      stars.current.rotation.x = stars.current.rotation.y += 0.00015;
    }
  });
  return <Stars ref={stars} />;
}

export const Starfield = memo(function Starfield({ theme = 'dark' }: StarfieldProps) {
  return (
    <StarBackground theme={theme} aria-hidden>
      <Canvas>
        <RotatingStars />
      </Canvas>
    </StarBackground>
  );
});

const StarBackground = styled.div<StarfieldProps>`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: ${({ theme }) => (theme === 'light' ? 'transparent' : '#292e49')};
`;
