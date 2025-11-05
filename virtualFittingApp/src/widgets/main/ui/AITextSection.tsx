import styled from "styled-components";
import { PAPER_VIRTUAL } from "../model/constants";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 

gsap.registerPlugin(ScrollTrigger);

function AITextSection() {
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
          id: 'ai-text-pin',
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
        ScrollTrigger.getById('ai-text-pin')?.kill();
    };
  }, []);

  return (
    <SectionContainer>
      <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>AI</ScreenText>
      <Wrapper ref={wrapperRef}>
          <Content>
            <ContentText>가상착용 AI</ContentText>
            <SubText>착용부터 구매까지</SubText>
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

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  overflow: hidden;
  gap: 16px;
  margin-left: 10vw;
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
  width: 50vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden; 
  padding: 24px; 
  
  background-image: url(${PAPER_VIRTUAL}); 
  background-size: contain;
  background-position: left top;
  background-repeat: no-repeat;
  will-change: background-size, background-position; 
`;

export { AITextSection };