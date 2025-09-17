import { useRef } from 'react';
import styled from 'styled-components';
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

const RotatingStars = () => {
const stars = useRef<THREE.Points>(null);

useFrame(() => {
    if (stars.current) {
    stars.current.rotation.x = stars.current.rotation.y += 0.00005;
    }
});

return <Stars ref={stars} />;
};

export function StarryBackground() {
  return (
    <BackgroundWrapper>
      <Canvas>
        <RotatingStars />
      </Canvas>
    </BackgroundWrapper>
  );
}

const BackgroundWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;