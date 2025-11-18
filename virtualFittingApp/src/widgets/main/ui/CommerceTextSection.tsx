import styled from "styled-components";
import { PAPER_VIRTUAL } from "../model/constants";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { BREAKPOINTS } from "@/shared/constants";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function CommerceTextSection() {
  const screenTextRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); 
  const [isHovered, setIsHovered] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const navigate = useNavigate();

  const handleImageClick = () => {
    const isMobile = window.innerWidth <= BREAKPOINTS.md;
    if (isMobile) {
      if (isOverlayVisible) {
        navigate("/saas");
      } else {
        setIsOverlayVisible(true);
      }
    } else {
      navigate("/saas");
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
          id: 'service-text-pin',
        },
      });

      tl.set(screenTextRef.current, { opacity: 0 });

      tl.to(
        screenTextRef.current,
        { opacity: 1, duration: 4, ease: "none" }
      )

      .to(
        screenTextRef.current,
        { opacity: 1, duration: 5, ease: "none" }
      )

      .to(
        screenTextRef.current,
        { opacity: 0, duration: 5, ease: "none" }
      );
    }

    return () => {
        ScrollTrigger.getById('ai-text-pin')?.kill();
    };
  }, []);

  return (
    <SectionContainer>
      <Wrapper ref={wrapperRef}>
        <ScreenText ref={screenTextRef} style={{ opacity: 0 }}>SaaS</ScreenText> 
          <Content>
            <TextBox>
              <ContentText>Commerce</ContentText>
              <SubText>함께 나아갈 파트너십 기반의 기술 레퍼런스</SubText>
            </TextBox>
            <ImageBox>
              <ImageContainer
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleImageClick}
              >
                <Img src={PAPER_VIRTUAL} alt="virtual" />
                {(isHovered || isOverlayVisible) && (
                  <SubtextOverlay>
                    <OverlayHeaderText>↗고객 경험 극대화 및 운영 자동화</OverlayHeaderText>
                    <OverlayText>
                      재고·결제·정산·프로모션 자동화로 운영 효율성을 극대화합니다.
                      모델 확보와 가상착용 서비스 제공을 통해 브랜드 런칭 기회를 드립니다.
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
  height: 200vh;
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
    justify-content: flex-start;
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
    margin-top: 20vh;
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
    font-size: 22px;
    text-align: center;
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
    height: 60vh;
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

export { CommerceTextSection };