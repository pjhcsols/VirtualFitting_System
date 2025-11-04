import styled from "styled-components";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 
import { GlassBox } from "@/shared/components/glass-box";
import { useRef, useEffect, ReactNode } from "react";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import AutoAwesomeIcon from '@mui/icons-material/Au';
// import AddBusinessIcon from '@mui/icons-material/AddBusiness';

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
        stagger: 0.15,
        ease: "power2.out"
    });

  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <HeadlineText ref={headlineRef}>
        지금 바실리움에서 가상착용 데모와 입점 기회를 확인하고, <br/>비즈니스를 업그레이드하세요.
      </HeadlineText>
      <SubText ref={subTextRef}>
        고객이 <StrongHighlight>‘입어본 듯’ 확신하고 결제하도록.</StrongHighlight> 단순히 옷을 보여주는 데서 그치지 않습니다.<br/>
        바실리움의 가상 피팅 기술은 실제 착용한 듯한 실감으로, 고객이 자신에게 어울리는 핏과 스타일을 직접 확인할 수 있게 합니다.<br/>
        체형에 꼭 맞는 추천을 제공하고, <StrongHighlight>쿠폰·결제·재고까지 한 번에 연동</StrongHighlight>되어 쇼핑 과정 전반이 매끄럽게 이어집니다.<br/>
        매장에서 직접 입어보는 듯한 경험을, 화면 속에서도 손끝 하나로 완성하세요.<br/>
      </SubText>
      <CardGrid>
        <div ref={el => cardRefs.current[0] = el as HTMLDivElement}> 
          <FeatureCard 
              icon={<TrendingUpIcon style={{ fontSize: '1em' }} />}
              title="구매 확신 및 전환율 상승" 
              content={<>
                  실감 나는 가상 피팅(Virtual Fitting) 경험을 제공하여 온라인 쇼핑의 불확실성을 해소합니다.<br/>
                  고객의 ‘입어본 듯한 확신’을 선사하여 망설임 없이 즉시 결제로 유도합니다.
              </>}
            />
        </div>
        <div ref={el => cardRefs.current[1] = el as HTMLDivElement}>
          <FeatureCard 
              // icon={<AddBusinessIcon style={{ fontSize: '1em' }} />}
              icon={null}
              title="정교한 매칭과 올인원 통합" 
              content={<>
                  정교한 사이즈 매칭 알고리즘 기반의 최적 핏 추천으로 반품 오류를 획기적으로 낮춥니다.<br/>
                  쿠폰·결제·재고 연동을 올인원으로 지원하여 운영 자동화와 비용 절감을 달성합니다.
              </>}
          />
        </div>
        <div ref={el => cardRefs.current[2] = el as HTMLDivElement}>
          <FeatureCard 
              // icon={<AutoAwesomeIcon style={{ fontSize: '1em' }} />}
              icon={null}
              title="미래형 커머스 성장 인프라" 
              content={<>
                  가상착용·입점·운영 자동화를 통합 제공하는 미래형 커머스 플랫폼입니다.<br/>
                  고객 경험 혁신을 통해 구매 전환율은 높이고 반품률은 낮추는 독보적인 성장 인프라를 제공합니다.
              </>}
          />
        </div>
      </CardGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  gap: 40px;
  overflow: visible; 
  padding: 5rem 2rem;
`;

const HeadlineText = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -2px;
  padding-bottom: 24px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const SubText = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -1px;
  text-align: center;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
`;

const StrongHighlight = styled.span`
  color: #B8D2FF; 
`;

const Card = styled(GlassBox)`
  width: auto; 
  flex-shrink: 0; 
  scroll-snap-align: none;
  padding: 24px;
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 12px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  overflow-x: hidden; 
  scroll-snap-type: none;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin: 30px auto;
  justify-content: center;

  & > div {
    align-self: flex-start;

    &:nth-child(even) {
      margin-top: 40px;
    }
  }

`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: #E9FAFF;
  svg {
    font-size: 1em;
    color: currentColor;
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #E9FAFF;
  margin: 0;
  line-height: 1.3;
`;

const CardContent = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.6;
  strong {
    font-weight: 800;
    color: #7FFFD4;
  }
`;

export { SolutionSection };