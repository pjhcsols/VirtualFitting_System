import styled from "styled-components";
import { PAPER_SCREEN } from "../model/constants";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function ServiceTextSection() {
  const screenTextRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (screenTextRef.current && wrapperRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current, 
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          id: 'service-text-pin',
        },
      });

      tl.fromTo(
        screenTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "none" }
      ).to(
        screenTextRef.current,
        { opacity: 0, duration: 0.5, ease: "none" }
      );
    }

    return () => {
        ScrollTrigger.getById('service-text-pin')?.kill();
    };
  }, []);

  return (
    <SectionContainer>
      <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>Service</ScreenText> 
      <Wrapper ref={wrapperRef}>
        <Content>
          <ContentText>서비스</ContentText>
          <SubText>입점부터 정산까지</SubText>
          <ImageBox></ImageBox>
        </Content>
      </Wrapper>
    </SectionContainer>
  );
}
const SectionContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200vh;
  overflow: hidden;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  overflow: hidden; 
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  overflow: hidden; 
  gap: 16px;
  margin-right: 10vw;
`;

const ScreenText = styled.div`
  font-size: 20vw;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  z-index: 3;
`;


const ContentText = styled.div`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;
  color: #fff;
`;

const SubText = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -1px;
  color: #fff;
`;

const ImageBox = styled.div`
  width: 40vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden; 
  padding: 24px; 
  
  background-image: url(${PAPER_SCREEN}); 
  background-size: contain;
  background-position: right top;
  background-repeat: no-repeat;
  will-change: background-size, background-position; 
`;

export { ServiceTextSection };