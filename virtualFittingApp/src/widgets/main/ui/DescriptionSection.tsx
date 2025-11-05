import styled from "styled-components";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 
import { HOODIE_IMAGES } from "../model/constants"; 

gsap.registerPlugin(ScrollTrigger);

const imageTrack = [...HOODIE_IMAGES, ...HOODIE_IMAGES]; 

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
      <DescriptionBox ref={descriptionRef}>
        <Title>casual & street brand</Title>
          <Text>
            <StrongHighlight>BASILIUM</StrongHighlight>은 '왕과 여왕의 장식'이라는 의미를 담아 고대 군주들이 착용한
            은장식의 모토 아래 탄생했습니다.<br/>
            기본 실루엣에 트렌디하고 모던한 감성을 더한 새로운 디자인으로,
            고급스러움과 신선함을 잃지 않는 브랜드로 성장할 것을 약속드립니다.
          </Text>
      </DescriptionBox>
      <CarouselWrapper>
        <CardTrack ref={trackRef}> 
          {imageTrack.map((hoodie, index) => (
              <HoodieImg src={hoodie.src} alt={hoodie.name} key={index} />
          ))}
        </CardTrack>
      </CarouselWrapper>
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

const CarouselWrapper = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden; 
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`;

const CardTrack = styled.div`
  display: flex;
  gap: 4rem;
  white-space: nowrap; 
`;

const HoodieImg = styled.img`
  width: 200px;
  height: 270px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const DescriptionBox = styled.div`
  max-width: 1200px;
  text-align: center;
  color: #fff;
`;

const BasiliumText = styled.span`
  font-family: "Prata-Regular";
  font-size: 10vw; 
  color: #E9FAFF;
  text-transform: uppercase;
  display: inline-block;
`;

const Letter = styled.span`
  display: inline-block;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #B8D2FF; 
  text-transform: uppercase;
  margin-bottom: 3rem;
  opacity: 0;
`;

const Text = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: -1px;
  color: #E9FAFF; 
  margin-bottom: 7rem;
  opacity: 0;
`;

const StrongHighlight = styled.span`
  font-family: "Prata-Regular";
  letter-spacing: 0;
`;

export { DescriptionSection };