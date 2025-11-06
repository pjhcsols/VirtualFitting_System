import styled from "styled-components";
import { PAPER_WEB3 } from "../model/constants";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function CommerceTextSection() {
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
      <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>Commerce</ScreenText> 
      <Wrapper ref={wrapperRef}>
          <Content>
            <TextBox>
              <ContentText>고객 경험 극대화 및 운영 자동화</ContentText>
              <SubText>
                  재고·결제·정산·프로모션 자동화로 운영 효율성을 극대화합니다.<br />
                  모델 확보와 가상착용 서비스 제공을 통해 브랜드 런칭 기회를 드립니다.
              </SubText>
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
  margin-top: 64px;
  margin-right:auto;
  height: 100%; 
`;

const ScreenText = styled.div`
  font-size: 15vw;
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
  
  background-image: url(${PAPER_WEB3}); 
  background-size: contain;
  background-position: right top;
  background-repeat: no-repeat;
  will-change: background-size, background-position; 
`;

export { CommerceTextSection };