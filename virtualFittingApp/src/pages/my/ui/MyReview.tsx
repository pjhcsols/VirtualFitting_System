import React, { Suspense, useRef } from "react";
import styled from "styled-components";
import { Header } from "@/shared";
import { ReviewContentList } from "@/pages/my/ui/ReviewContentList";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

function MyReview() {
  const RotatingStars = () => {
    const stars = useRef<THREE.Points>(null);
    
    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x = stars.current.rotation.y += 0.00005;
      }
    });
    
    return <Stars ref={stars} />;
  };

  return (
    <PageWrapper>
      <StarBackground>
        <Canvas>
          <RotatingStars />
        </Canvas>
      </StarBackground>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>

      <ContentWrapper>
        <Suspense fallback={<div>불러오는 중...</div>}>
          <ReviewContentList />
        </Suspense>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyReview };

const PageWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
`;

const StarBackground = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;