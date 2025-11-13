import styled from "styled-components";
import { PAPER_WEB3 } from "../model/constants";
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
          id: 'service-text-pin',
        },
      });

      tl.set(screenTextRef.current, { yPercent: 200, opacity: 0 });

      tl.to(
        screenTextRef.current,
        { yPercent: 0, opacity: 1, duration: 3, ease: "none" }
      )

      .to(
        screenTextRef.current,
        { yPercent: 0, opacity: 1, duration: 5, ease: "none" }
      )

      .to(
        screenTextRef.current,
        { opacity: 0, duration: 1, ease: "none" }
      );
    }

    return () => {
        ScrollTrigger.getById('ai-text-pin')?.kill();
    };
  }, []);

  return (
    <SectionContainer>
      <Wrapper ref={wrapperRef}>
        <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>AI/Tech</ScreenText>
          <Content>
            <ImageBox></ImageBox>
            <TextBox>
              <ContentText>Web3.0 기반의 기술 혁신</ContentText>
              <SubText>
                BASILIUM은 AI 접근성, 저지연 운영에 신원관리와 Web3.0 기술을 결합했습니다.<br />
                메타데이터 신뢰성, DID 인프라, 모듈형 API/SDK 아키텍처로 확장성을 확보합니다.<br />
                고객은 비용 제약 없는 편리함을, 고객사는 낮은 초기비용과 빠른 ROI를 경험합니다.
              </SubText>
            </TextBox>
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
  align-items: start;
  overflow: hidden; 
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch; 
  overflow: hidden;
  gap: 16px; 
  margin-left: 10vw;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: start; 
  overflow: hidden;
  margin-right:auto;
  height: 100%; 
`;

const ScreenText = styled.div`
  font-size: 15vw;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;

  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translate(-50%, -50%);
  
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  z-index: 3;
  mix-blend-mode: difference
`;


const ContentText = styled.div`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;
  color: #fff;
  padding-bottom: 24px;
`;

const SubText = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -1px;
  color: #fff;
  text-align:left;
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
  
  background-image: url(${PAPER_WEB3}); 
  background-size: contain;
  background-position: left top;
  background-repeat: no-repeat;
  will-change: background-size, background-position; 
`;

export { AITextSection };