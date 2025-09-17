  import React, { Suspense,useRef } from "react";
  import styled from "styled-components";
  import { OrderListContent } from "@/pages/my/ui/OrderContentList";
  import { BREAKPOINTS } from "@/shared";
  import * as THREE from "three";
  import { Stars } from "@react-three/drei";
  import { Canvas, useFrame } from "@react-three/fiber";
  

  function MyOrderList() {
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
        </HeaderWrapper>

        <ContentWrapper>
          <InnerContent>
            <Suspense fallback={<div>불러오는 중...</div>}>
              <OrderListContent />
            </Suspense>
          </InnerContent>
        </ContentWrapper>
      </PageWrapper>
    );
  }

  export { MyOrderList };


  const PageWrapper = styled.div`
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
    margin-top: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex-grow: 1;
  `;

const InnerContent = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 30px 30px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;

const StarBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;