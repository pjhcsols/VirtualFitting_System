import styled from "styled-components";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 

gsap.registerPlugin(ScrollTrigger);

function ActionTextSection() {
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
        지금 바실리움에서 가상착용 데모를 확인하세요.
      </HeadlineText>
      <SubText ref={subTextRef}>
        고객이 <StrongHighlight>‘입어본 듯’ 확신하고 결제하도록.</StrongHighlight> 단순히 옷을 보여주는 데서 그치지 않습니다.<br/>
        바실리움의 가상 피팅 기술은 실제 착용한 듯한 실감으로, 고객이 자신에게 어울리는 핏과 스타일을 직접 확인할 수 있게 합니다.<br/>
        체형에 꼭 맞는 추천을 제공하고, <StrongHighlight>쿠폰·결제·재고까지 한 번에 연동</StrongHighlight>되어 쇼핑 과정 전반이 매끄럽게 이어집니다.<br/>
        매장에서 직접 입어보는 듯한 경험을, 화면 속에서도 손끝 하나로 완성하세요.<br/>
      </SubText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  align-items: center;
  overflow: hidden; 
  padding: 24px; 
  height: 300px; 
`;
const HeadlineText = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -2px;
  padding-bottom: 64px;
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
  padding-bottom: 24px;
`;

const StrongHighlight = styled.span`
  color: #B8D2FF; 
`;


export { ActionTextSection };