import styled from "styled-components";
import { GlassBox } from "@/shared/components/glass-box";

function SaaSSection() {
  return (
    <Wrapper>
      <Headline>
        하나의 플랫폼에서 모든 것을.
      </Headline>
      <Description>
        BASILIUM은 AI 기반 가상착용, 브랜드 입점, 운영 자동화를 하나의 플랫폼에서 제공합니다.<br/>
        개인 고객은 손쉽게 가상 피팅과 쇼핑을 경험하고, 브랜드 고객은 상품·재고·주문 관리를 한 곳에서 처리할 수 있습니다.
      </Description>

      <BoxesWrapper>
        <GlassBoxStyled>
          <BoxTitle>자동화된 가상 착용</BoxTitle>
          <BoxText>
            이미지 업로드만으로 AI가 자동으로 착용 이미지를 생성, 반복 작업 없이 빠르게 시각화합니다.
          </BoxText>
        </GlassBoxStyled>

        <GlassBoxStyled>
          <BoxTitle>브랜드 운영 최적화</BoxTitle>
          <BoxText>
            ERP/PG 연동, 쿠폰/프로모션 자동화로 운영 효율성을 높이고, 초기 비용과 시간을 단축합니다.
          </BoxText>
        </GlassBoxStyled>

        <GlassBoxStyled>
          <BoxTitle>고속·고품질 AI 서비스</BoxTitle>
          <BoxText>
            Low-High 화질 전환과 AI 모델 최적화로 4~8초 내 사용자 맞춤 가상 착용 이미지를 제공합니다.
          </BoxText>
        </GlassBoxStyled>

        <GlassBoxStyled>
          <BoxTitle>안전·신뢰성</BoxTitle>
          <BoxText>
            Web3.0 기반 VC/DID 시스템과 블록체인 연동으로 이미지 무단 사용 및 변조를 방지합니다.
          </BoxText>
        </GlassBoxStyled>

        <GlassBoxStyled>
          <BoxTitle>사회적·환경적 기여</BoxTitle>
          <BoxText>
            정확한 가상 피팅과 자동화 시스템으로 반품률을 낮추어 탄소·자원 낭비를 줄이고, 신시장과 일자리를 창출합니다.
          </BoxText>
        </GlassBoxStyled>
      </BoxesWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: #fff;
  text-align: center;
`;

const Headline = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const BoxesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const GlassBoxStyled = styled(GlassBox)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const BoxTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const BoxText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

export { SaaSSection };
