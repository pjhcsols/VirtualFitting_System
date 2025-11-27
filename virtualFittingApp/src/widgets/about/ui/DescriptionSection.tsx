import styled from "styled-components";
import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 
import { GlassBox } from "@/shared/components/glass-box";
import { BREAKPOINTS } from "@/shared";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DataAnalyticsIcon from '@mui/icons-material/Assessment'; 
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

gsap.registerPlugin(ScrollTrigger);

type FeatureCardProps = {
  title: string;
  content: React.ReactNode;
  icon: ReactNode; 
};


const FeatureCard = ({ title, content, icon }: FeatureCardProps) => (
  <Card borderRadius="24px">
    <CardIcon>{icon}</CardIcon>
    <CardTitle>{title}</CardTitle>
    <CardContent>{content}</CardContent>
  </Card>
);


function DescriptionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = textRefs.current.filter(ref => ref !== null);
    const cards = cardRefs.current.filter(ref => ref !== null);

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

    if (cards.length > 0 && cardGridRef.current) {
      gsap.fromTo(cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardGridRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none none',
          }
        }
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
          우리는 기술로 패션의 경계를 허물고,
          브랜드와 고객을 가장 자연스럽게 이어줍니다.<br />
          AI가 만든 첫 번째 피팅룸으로,
          누가, 언제, 어디서든 자신만의 스타일을 입을 수 있는 세상을 엽니다.<br /><br />
           <Highlight>BASILIUM</Highlight>은 패션 산업의 새로운 길을 제시합니다.<br />
          입는 모든 순간,<Highlight>BASILIUM</Highlight>에서 시작됩니다.
        </Paragraph>
      </TextBlock>
      <CardGrid ref={cardGridRef}>
        <CardWrapper ref={el => { if (el) cardRefs.current[0] = el; }}>
          <FeatureCard 
              icon={<TrendingUpIcon style={{ fontSize: '1em' }} />}
              title="높은 구매 전환율" 
              content={<>
                  AI 가상 피팅을 통해 온라인 쇼핑의 불확실성을 완전히 해소합니다.
                  고객에게 망설임 없는 즉시 결제 확신을 선사하여 구매 전환율을 극대화합니다.
              </>}
            />
        </CardWrapper>
        <CardWrapper ref={el => { if (el) cardRefs.current[1] = el; }}>
          <FeatureCard 
              icon={<AddBusinessIcon style={{ fontSize: '1em' }} />}
              title="반품 오류 최소화"
              content={<>
                  정교한 사이즈 매칭 알고리즘 기반으로 고객에게 최적의 핏을 추천합니다.
                  불필요한 반품 오류를 획기적으로 낮추고, 물류 및 운영 비용을 절감합니다.
              </>}
          />
        </CardWrapper>
        <CardWrapper ref={el => { if (el) cardRefs.current[2] = el; }}>
          <FeatureCard 
              icon={<AutoAwesomeIcon style={{ fontSize: '1em' }} />}
              title="입점 자동화" 
              content={<>
                  복잡했던 입점·운영 절차를 3단계로 간소화하고, 쿠폰·결제·재고 연동을 올인원으로 통합 지원합니다.
                  브랜드 성장에 필요한 모든 과정을 자동화하여 운영 효율을 높입니다.
              </>}
          />
        </CardWrapper>
        <CardWrapper ref={el => { if (el) cardRefs.current[3] = el; }}>
          <FeatureCard 
              icon={<DataAnalyticsIcon style={{ fontSize: '1em' }} />}
              title="맞춤형 성장 지원" 
              content={<>
                  AI 기반의 고객 행동 및 구매 데이터를 실시간으로 분석하여 제공합니다.
                  이를 통해 맞춤형 마케팅 전략을 수립하고, 비즈니스 성장의 방향을 정교하게 제시합니다.
              </>}
          />
        </CardWrapper>
        <CardWrapper ref={el => { if (el) cardRefs.current[4] = el; }}>
          <FeatureCard 
            icon={<CurrencyBitcoinIcon style={{ fontSize: '1em' }} />}
            title="Web3.0 신원·AI 이미지" 
            content={<>
                AI 가상착용 이미지 메타데이터와 블록체인을 결합한 탈중앙화 분산원장(Distributed Ledger) 기술로 
                차세대 Web 3.0 기반 인하우스 신원·자격증명 시스템을 구축했습니다.
            </>}
          />
        </CardWrapper>
      </CardGrid>
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
  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 3.5rem;
    line-height: 1.6;
  }
  letter-spacing: 0px;
`;

const TextBlock = styled.div`
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Paragraph = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.3px;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  z-index: 3;
  letter-spacing: -1px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const Highlight = styled.span`
  font-family: "Prata-Regular";
  font-weight: 700;
  letter-spacing: 0px;
`;

const Letter = styled.span`
  display: inline-block;
`;

const Card = styled(GlassBox)`
  width: 100%; 
  height: 240px;
  flex-shrink: 0; 
  padding: 24px; 
  display: flex;
  flex-direction: column;
  text-align: left;

  @media (max-width: ${BREAKPOINTS.md}px) {
    height: auto;
  }
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 3rem;
`;

const CardWrapper = styled.div`
  flex-basis: 100%;

  @media (min-width: ${BREAKPOINTS.md}px) {
    flex-basis: 45%;
  }

  @media (min-width: ${BREAKPOINTS.lg}px) {
    flex-basis: 30%;
  }
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%; 
  background: rgba(233, 250, 255, 0.15); 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px; 
  
  font-size: 1.5rem;
  color: #fff; 
  
  svg {
    font-size: 1.2em; 
    color: currentColor;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #E9FAFF;
  margin-bottom:16px;
  line-height: 1.3;
  letter-spacing: -1px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 22px;
  }
`;

const CardContent = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  margin: 0;
  line-height: 1.6;
  letter-spacing: -1px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 14px;
  }
`;

export { DescriptionSection };