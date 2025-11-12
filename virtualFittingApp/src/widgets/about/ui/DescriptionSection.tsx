import styled from "styled-components";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 

gsap.registerPlugin(ScrollTrigger);

function DescriptionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = textRefs.current.filter(ref => ref !== null);
    gsap.set(letters, { opacity: 0, y: 30 });
    
    gsap.to(letters, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center+=150",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    const track = trackRef.current;
    
    if (track) {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = trackWidth - viewportWidth + 200; 

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current, 
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    }

    if (descriptionRef.current) { 
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: descriptionRef.current, 
          start: "top bottom", 
          toggleActions: "play none none none",
        }
      });

      tl.fromTo(
        descriptionRef.current.querySelector('h2'), 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        descriptionRef.current.querySelector('p'), 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <Wrapper ref={sectionRef}>
      <BasiliumText>
        {"BASILIUM".split("").map((char, index) => (
          <Letter key={index} ref={el => textRefs.current[index] = el as HTMLSpanElement}>
            {char}
          </Letter>
        ))}
      </BasiliumText>
        <TextBlock ref={descriptionRef}>
        <Paragraph>
          우리는 기술로 패션의 경계를 허물고,<br />
          브랜드와 고객을 가장 자연스럽게 이어줍니다.<br /><br />
          AI가 만든 첫 번째 피팅룸으로,<br />
          누가, 언제, 어디서든 자신만의 스타일을 입을 수 있는 세상을 엽니다.<br /><br />
           <Highlight>BASILIUM</Highlight>은 패션 산업의 새로운 길을 제시합니다.<br />
          입는 모든 순간,  <Highlight>BASILIUM</Highlight>에서 시작됩니다.
        </Paragraph>
      </TextBlock>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: center;
  overflow: hidden; 
  padding: 24px; 
  height: auto; 
`;

const BasiliumText = styled.span`
  font-family: "Prata-Regular";
  font-size: 10vw; 
  color: #E9FAFF;
  text-transform: uppercase;
  display: inline-block;
`;

const TextBlock = styled.div`
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
`;

const Paragraph = styled.p`
  font-size: 1.2vw;
  font-weight: 400;
  line-height: 2.0;
  letter-spacing: -0.3px;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  z-index: 3;
`;

const Highlight = styled.span`
  font-family: "Prata-Regular";
  font-weight: 700;
`;

const Letter = styled.span`
  display: inline-block;
`;

export { DescriptionSection };