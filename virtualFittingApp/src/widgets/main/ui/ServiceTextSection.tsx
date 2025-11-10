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
        ScrollTrigger.getById('service-text-pin')?.kill();
    };
  }, []);

  return (
    <SectionContainer>
      
      <Wrapper ref={wrapperRef}>
        <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>Service</ScreenText> 
          <Content>
            <TextBox>
              <ContentText>통합 플랫폼 및 역할별 접근성</ContentText>
              <SubText>
                원앱 및 통합 사이트에서 일반/기업 고객이 역할·권한에 따라 다른 화면을 봅니다.<br />
                의류 브랜드 등록 및 입점은 "회원가입, 입점 요청, 데모/런칭" 3단계로 간소화됩니다.<br />
                바실리움은 가상착용, 브랜드 입점, 운영 자동화를 제공하는 종합 플랫폼입니다.</SubText>
            </TextBox>
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
  flex-direction: row;
  justify-content: center;
  align-items: stretch; 
  overflow: hidden;
  gap: 16px; 
  margin-right: 10vw;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: end; 
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
  top: 2%;
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
  text-align:right;
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