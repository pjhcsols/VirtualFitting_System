import styled from "styled-components";
import { PAPER_SCREEN } from "../model/constants";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { BREAKPOINTS } from "@/shared/constants";

gsap.registerPlugin(ScrollTrigger);

function ServiceTextSection() {
  const screenTextRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
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
        navigate("/service");
      } else {
        setIsOverlayVisible(true);
      }
    } else {
      navigate("/service");
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
            start: "top bottom",
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
        <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>Service</ScreenText> 
          <Content ref={contentRef}>
            <TextBox>
              <ContentText>통합 서비스</ContentText>
              <SubText>하나의 플랫폼에서 모든 사용자 경험을 혁신하는 바실리움</SubText>
            </TextBox>
            <ImageBox>
              <ImageContainer
                onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
                onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
                onClick={handleImageClick}
              >
                <Img src={PAPER_SCREEN} alt="Service" />
                {(isHovered || isOverlayVisible) && (
                  <SubtextOverlay>
                    <OverlayHeaderText>↗통합 플랫폼 및 역할별 접근성</OverlayHeaderText>
                    <OverlayText>
                      원앱 및 통합 사이트에서 일반/기업 고객이 역할·권한에 따라
                      다른 화면을 봅니다.
                      의류 브랜드 등록 및 입점은 "회원가입, 입점 요청,
                      데모/런칭" 3단계로 간소화됩니다.
                      바실리움은 가상착용, 브랜드 입점, 운영 자동화를 제공하는
                      종합 플랫폼입니다.
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
  left: 30%;
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
  align-items: end; 
  overflow: hidden; 
  padding-right: 10vw;

  @media (max-width: ${BREAKPOINTS.md}px) {
    align-items: center;
    padding-right: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  overflow: hidden;
  gap: 16px; 
  
  margin-right: 0; 
  
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
  margin-right:auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    align-items: center;
    text-align: center;
    margin-right: 0;
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

export { ServiceTextSection };