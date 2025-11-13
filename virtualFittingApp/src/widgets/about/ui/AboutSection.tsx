import styled from "styled-components";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { PAPER_IMAGE } from "../model/constants";

gsap.registerPlugin(ScrollTrigger);

function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const paperImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headline1Ref.current || !headline2Ref.current || !paperImageRef.current) return;

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

    tl.to(headline1Ref.current, { opacity: 0, ease: "power1.out" }, 0)
      .fromTo(
        headline2Ref.current,
        { opacity: 0 },
        { opacity: 1, ease: "power1.out" },
        0.1
      );

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  return (
    <SectionContainer>
      <Wrapper ref={sectionRef}>
        <TextContainer>
          <HeadlineText ref={headline1Ref}>
            AI가 만든 첫 번째 피팅룸, 바실리움.
          </HeadlineText>

          <HeadlineText ref={headline2Ref} style={{ opacity: 0 }}>
            브랜드를 더 쉽게, 고객을 더 가깝게.<br />
            패션의 새로운 표준을 엽니다.
          </HeadlineText>
        </TextContainer>

        <ImageContainer>
          <PaperImage ref={paperImageRef} src={PAPER_IMAGE} alt="Basilium concept image" />
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
`;

const TextContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeadlineText = styled.div`
  font-size: 3.2vw;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.5px;
  text-align: left;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
`;

const PaperImage = styled.img`
  width: 100%;
  height: 80vh;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform-origin: center bottom;
`;

export { AboutSection };
