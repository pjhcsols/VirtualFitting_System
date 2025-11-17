import styled from "styled-components";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 
import { GlassBox } from "@/shared/components/glass-box";
import { useRef, useEffect, ReactNode } from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DataAnalyticsIcon from '@mui/icons-material/Assessment'; 
import { BREAKPOINTS } from "@/shared";

gsap.registerPlugin(ScrollTrigger); 

type FeatureCardProps = {
    title: string;
    content: React.ReactNode;
    icon: ReactNode; 
};

const FeatureCard = ({ title, content, icon }: FeatureCardProps) => (
    <Card>
      <CardIcon>{icon}</CardIcon>
      <CardTitle>{title}</CardTitle>
      <CardContent>{content}</CardContent>
    </Card>
);

function SolutionSection() {
  const wrapperRef = useRef(null); 
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); 
  const headlineRef = useRef(null);
  const subTextRef = useRef(null);

  useEffect(() => {
    const cards = cardRefs.current.filter(ref => ref !== null);
    const elementsToAnimate = [
      headlineRef.current,
      subTextRef.current,
      ...cards
    ].filter(el => el !== null);

    gsap.set(elementsToAnimate, { opacity: 0, y: 50 });

    gsap.to(elementsToAnimate, {
        scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top center+=100", 
            toggleActions: "play none none none", 
        },
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.4,
        ease: "power2.out"
    });

  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <HeadlineText ref={headlineRef}>
        AI 기반의 미래형 커머스 플랫폼으로 <br/>고객 경험과 비즈니스 효율을 혁신합니다.
      </HeadlineText>
      <CardGrid>
        <div ref={el => cardRefs.current[0] = el as HTMLDivElement}> 
          <FeatureCard 
              icon={<TrendingUpIcon style={{ fontSize: '1em' }} />}
              title="높은 구매 전환율" 
              content={<>
                  AI 가상 피팅을 통해 온라인 쇼핑의 불확실성을 완전히 해소합니다.
                  고객에게 망설임 없는 즉시 결제 확신을 선사하여 구매 전환율을 극대화합니다.
              </>}
            />
        </div>
        <div ref={el => cardRefs.current[1] = el as HTMLDivElement}>
          <FeatureCard 
              icon={<AddBusinessIcon style={{ fontSize: '1em' }} />}
              title="반품 오류 최소화"
              content={<>
                  정교한 사이즈 매칭 알고리즘 기반으로 고객에게 최적의 핏을 추천합니다.
                  불필요한 반품 오류를 획기적으로 낮추고, 물류 및 운영 비용을 절감합니다.
              </>}
          />
        </div>
        <div ref={el => cardRefs.current[2] = el as HTMLDivElement}>
          <FeatureCard 
              icon={<AutoAwesomeIcon style={{ fontSize: '1em' }} />}
              title="입점 자동화" 
              content={<>
                  복잡했던 입점·운영 절차를 3단계로 간소화하고, 쿠폰·결제·재고 연동을 올인원으로 통합 지원합니다.
                  브랜드 성장에 필요한 모든 과정을 자동화하여 운영 효율을 높입니다.
              </>}
          />
        </div>
        <div ref={el => cardRefs.current[3] = el as HTMLDivElement}>
          <FeatureCard 
              icon={<DataAnalyticsIcon style={{ fontSize: '1em' }} />}
              title="맞춤형 성장 지원" 
              content={<>
                  AI 기반의 고객 행동 및 구매 데이터를 실시간으로 분석하여 제공합니다.
                  이를 통해 맞춤형 마케팅 전략을 수립하고, 비즈니스 성장의 방향을 정교하게 제시합니다.
              </>}
          />
        </div>
      </CardGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: start;
  gap: 40px;
  overflow: visible; 
  padding: 5rem 10rem;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    padding: 4rem 5rem;
  }
  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 3rem 2rem;
  }
`;

const HeadlineText = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
  letter-spacing: -2px;
  padding-bottom: 32px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 32px;
    text-align: left;
  }    
`;

const Card = styled(GlassBox)`
  width: auto; 
  flex-shrink: 0; 
  scroll-snap-align: none;
  padding: 24px; 
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const CardGrid = styled.div`
  display: grid;
  width: 100%;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);

  & > div:nth-child(even) {
    margin-top: 40px;
  }

  @media (max-width: ${BREAKPOINTS.lg}px) {
    & > div:nth-child(even) {
      margin-top: 0;

    }
  }

  @media (max-width: ${BREAKPOINTS.md}px) {
    grid-template-columns: 1fr;
  }
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%; 
  background: rgba(233, 250, 255, 0.15); 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px; 
  
  font-size: 2rem;
  color: #fff; 
  
  svg {
    font-size: 1.2em; 
    color: currentColor;
  }
`;

const CardTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  color: #E9FAFF;
  margin-bottom:16px;
  line-height: 1.3;
  letter-spacing: -1px;
`;

const CardContent = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  margin: 0;
  line-height: 1.6;
  letter-spacing: -1px;
`;

export { SolutionSection };