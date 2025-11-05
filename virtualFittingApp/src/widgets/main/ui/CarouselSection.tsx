import styled from "styled-components";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 
import { HOODIE_IMAGES } from "../model/constants"; 

gsap.registerPlugin(ScrollTrigger);

const imageTrack = [...HOODIE_IMAGES, ...HOODIE_IMAGES]; 

function CarouselSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=150",
            toggleActions: "play none none none",
            id: 'master-carousel-anim'
        }
    });

    const letters = textRefs.current.filter(ref => ref !== null);
    gsap.set(letters, { opacity: 0, y: 30 });

    masterTl.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out"
    });

    if (descriptionRef.current && titleRef.current) {
        const textElement = descriptionRef.current.querySelector('p');

        masterTl.fromTo(
            titleRef.current, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" },
            "-=0.3"
        );
        
        masterTl.fromTo(
            textElement, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.8"
        );
    }
    
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
    
    return () => {
        // 모든 ScrollTrigger 정리
        ScrollTrigger.getById('master-carousel-anim')?.kill();
        ScrollTrigger.getById('carousel-track')?.kill();
        // 기타 모든 트리거 정리 (안전하게)
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <Wrapper ref={sectionRef}>
      <HeadlineText>
        {"공식입점 브랜드부터, 다양한 스토어를.".split("").map((char, index) => (
          <Letter 
            key={index} ref={el => textRefs.current[index] = el as HTMLSpanElement}
            style={{ 
                display: 'inline-block', 
                whiteSpace: 'pre' 
            }}
            >
            {char}
          </Letter>
        ))}
        </HeadlineText>
      <DescriptionBox ref={descriptionRef}>
        <Title ref={titleRef}>Virtual Fitting System & Brand Onboarding Website</Title>
        <Text>
          공식 계약을 통해 입점한 검증된 브랜드의 제품만을 취급하여 고객들에게 확실한 정품과 최상의 경험을 제공합니다. <br/>
          브랜드 오너에게 안정적인 판매 채널을, 고객에게 믿고 구매할 수 있는 안전한 쇼핑 환경을. <br/>
          모든 취향을 만족시킬 수 있는 무한한 선택의 폭을 만나보세요. 지금, 비즈니스의 성장을 시작하세요.<br/>
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

const HeadlineText = styled.div`
  font-size: 56px; 
  color: #E9FAFF;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
`;

const DescriptionBox = styled.div`
  max-width: 1200px;
  text-align: center;
  color: #fff;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -1px;
  color: #B8D2FF; 
  text-transform: uppercase;
  margin-bottom: 2rem;
`;

const Text = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: -1px;
  color: #E9FAFF; 
  margin-bottom: 7rem;
`;

const Letter = styled.span`
  display: inline-block;
`;

export { CarouselSection };