import styled from "styled-components";
import { PAPER_WEB3 } from "../model/constants";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap"; 
import { BREAKPOINTS } from "@/shared/constants";
import { ScrollTrigger } from "gsap/all"; 

gsap.registerPlugin(ScrollTrigger);

function AITextSection() {
  const screenTextRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= BREAKPOINTS.md);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= BREAKPOINTS.md);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageClick = () => {
    if (isMobile) {
      if (isOverlayVisible) {
        navigate("/about");
      } else {
        setIsOverlayVisible(true);
      }
    } else {
      navigate("/about");
    }
  };

  useEffect(() => {
    if (screenTextRef.current && wrapperRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          id: "service-text-pin",
        },
      });

      tl.set(screenTextRef.current, { opacity: 0 })
        .to(screenTextRef.current, { opacity: 1, duration: 4 })
        .to(screenTextRef.current, { opacity: 1, duration: 5 })
        .to(screenTextRef.current, { opacity: 0, duration: 4 });

      const h = window.innerHeight;

      gsap.fromTo(
        contentRef.current,
        { y: h },
        {
          y: -h ,
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "middle top",
            end: "bottom top",
            scrub: true,
            id: "service-content-mobile-move",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getById("service-text-pin")?.kill();
      ScrollTrigger.getById("service-content-mobile-move")?.kill();
    };
  }, [isMobile]);

  return (
    <SectionContainer>
      <Wrapper ref={wrapperRef}>
        <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>AI/Tech</ScreenText>
          <Content ref={contentRef}>
            <TextBox>
              <ContentText>Web3.0 · AI 기술</ContentText>
              <SubText>나만의 데이터 주권을 보장하는 차세대 AI 이미지 제공</SubText>
            </TextBox>
            <ImageBox>
              <ImageContainer
                onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
                onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
                onClick={handleImageClick}
              >
                <Img src={PAPER_WEB3} alt="about" />
                {(isHovered || isOverlayVisible) && (
                  <SubtextOverlay>
                    <OverlayHeaderText>↗Web3.0 기반의 기술 혁신</OverlayHeaderText>
                    <OverlayText>
                      BASILIUM은 AI 접근성, 저지연 운영에 신원관리와 Web3.0 기술을 결합했습니다.
                      메타데이터 신뢰성, DID 인프라, 모듈형 API/SDK 아키텍처로 확장성을 확보합니다.
                      고객은 비용 제약 없는 편리함을, 고객사는 낮은 초기비용과 빠른 ROI를 경험합니다.
                    </OverlayText>
                  </SubtextOverlay>
                )}
              </ImageContainer>
            </ImageBox>
          </Content>
      </Wrapper>
    </SectionContainer>
  );
}


const SectionContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ScreenText = styled.div`
  font-size: clamp(80px, 15vw, 240px);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;

  position: absolute;
  top: 50%;
  left: 70%;
  transform: translate(-50%, -50%);
  
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  z-index: 3;
  mix-blend-mode: difference;

  @media (max-width: ${BREAKPOINTS.md}px) {
    top: 10vh;
    left: 50%;
    font-size: clamp(60px, 15vw, 100px);
    transform: translate(-50%, 0);
  }
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
  padding-left: 10vw;

  @media (max-width: ${BREAKPOINTS.md}px) {
    align-items: center;
    padding-left: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  overflow: hidden;
  gap: 16px; 
  
  margin-left: 0; 
  
  max-width: 1400px;
  width: auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    margin-right: 0;
    width: 90%;
    align-items: center;
  }
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: start; 
  overflow: hidden;
  margin-right: auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    align-items: center;
    text-align: center;
    margin-left: auto;
  }
`;

const ContentText = styled.div`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  text-align: left;
  letter-spacing: -1px;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-bottom: 24px;
  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 20px;
    text-align: center;
    padding-bottom: 4px;
  }
`;

const SubText = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -1px;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align:left;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 16px;
    text-align: center;
  }
`;

const ImageBox = styled.div`
  width: 500px; 
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto; 
  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 90vw;
    height: 50vh;
    margin-left: 0;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden; 
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; 
  display: block;
`;

const SubtextOverlay = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  box-sizing: border-box;
  padding: 24px;

  ${ImageContainer}:hover & {
    opacity: 1;
  }
`;

const OverlayHeaderText = styled.div`
  display: flex;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -1px;
  color: #fff;
  padding-bottom: 24px;
  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 22px;
  }
`;

const OverlayText = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
  padding-top: 20px;
  
  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 14px;
  }
`;

export { AITextSection };