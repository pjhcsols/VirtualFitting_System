import styled from "styled-components";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { BREAKPOINTS } from "@/shared";
import { PAPER_IMAGE, TAG_IMAGE } from "../model/constants";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  PAPER_IMAGE,
  TAG_IMAGE,
];

function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const paperImageRef = useRef<HTMLImageElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !headline1Ref.current ||
      !headline2Ref.current ||
      !paperImageRef.current
    )
      return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      },
    });

    tl.to(paperImageRef.current, { scale: 1.1, ease: "power1.inOut" }, 0);

    tl.to(headline1Ref.current, { opacity: 0, ease: "power1.out" }, 0).fromTo(
      headline2Ref.current,
      { opacity: 0 },
      { opacity: 1, ease: "power1.out" },
      0.1
    );

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  return (
    <SectionContainer>
      <Wrapper ref={sectionRef}>
        <TextContainer>
          <HeadlineText ref={headline1Ref}>
            AI가 만든 첫 번째 피팅룸, <br />
            바실리움.
          </HeadlineText>
          <HeadlineText ref={headline2Ref} style={{ opacity: 0 }}>
            브랜드를 더 쉽게,
            <br />
            고객을 더 가깝게.
            <br />
            패션의 새로운 표준을 엽니다.
          </HeadlineText>
        </TextContainer>
        <ImageContainer>
          <PaperImage
            ref={paperImageRef}
            src={IMAGES[currentImageIndex]}
            alt="Basilium concept image"
          />
        </ImageContainer>
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6vw;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 120px 5vw 10vw 5vw;
    justify-content: center;
  }
`;

const TextContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    z-index: 10;
    padding: 20px;
    flex: none; 
    order: 1; 
  }
`;

const HeadlineText = styled.div`
  font-size: 3.5vw;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  text-align: left;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 6vw;
    text-align: center;
  }
`;

const ImageContainer = styled.div`
  width: 500px;
  height: 70vh;  
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  position: relative;
  @media (max-width: ${BREAKPOINTS.md}px) {
    flex: none; 
    width: 100%;
    height: 70vh;
    order: 2; 
    
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 5;
      pointer-events: none;
    }
  }
`;

const PaperImage = styled.img`
  width: 100%;
  height: 80vh;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform-origin: center bottom;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export { AboutSection };
