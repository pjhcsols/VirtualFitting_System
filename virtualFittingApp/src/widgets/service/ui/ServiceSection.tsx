import styled from "styled-components";
import { GlassBox } from "@/shared/components/glass-box";
import { GlassButton } from "@/shared/components/glass-button";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BREAKPOINTS } from "@/shared";

function ServiceSection() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < BREAKPOINTS.md
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Wrapper>
      <Headline>
        {isMobile ? (
            <>
              멤버만을 위한<br />
              혜택 한눈에 보기.
            </>
          ) : (
            "멤버만을 위한 혜택 한눈에 보기."
          )}
      </Headline>
      <ButtonWrapper>
        <GlassButton size="large" onClick={() => navigate("/signup")}>
          시작하기
        </GlassButton>
      </ButtonWrapper>
      <BoxesWrapper>
        <GlassBoxStyled borderRadius="18px">
          <ColumnTitle>일반 회원 혜택</ColumnTitle>
          <ServicesGrid>
            <ServiceCard>
              <ServiceIcon><SmartToyIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>AI 가상착용</ServiceTitle>
              <ServiceText>사진만 업로드하면 “입어본 듯”한 생생한 체험</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><ShoppingCartIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>온라인 쇼핑</ServiceTitle>
              <ServiceText>빠른 옵션 선택과 결제, 최적화된 쇼핑 경험</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><LocalOfferIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>맞춤형 쿠폰 & 할인</ServiceTitle>
              <ServiceText>자동 최적 할인 적용, 장바구니 병합</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><LocalShippingIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>배송·반품 관리</ServiceTitle>
              <ServiceText>사이즈 추천으로 반품 감소</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><SecurityIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>안전 데이터 관리</ServiceTitle>
              <ServiceText>개인 이미지와 정보 안전 보장</ServiceText>
            </ServiceCard>
          </ServicesGrid>
        </GlassBoxStyled>
        <GlassBoxStyled borderRadius="18px">
          <ColumnTitle>브랜드 회원 혜택</ColumnTitle>
          <ServicesGrid>
            <ServiceCard>
              <ServiceIcon><SmartToyIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>AI 가상착용</ServiceTitle>
              <ServiceText>제품을 빠르게 시각화, 마케팅·디자인 활용 가능</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><ShoppingCartIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>온라인 쇼핑</ServiceTitle>
              <ServiceText>실시간 재고/옵션 반영, 고객 유입 확대</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><LocalOfferIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>맞춤형 쿠폰 & 할인</ServiceTitle>
              <ServiceText>쿠폰·프로모션 자동화로 운영 효율화</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><LocalShippingIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>배송·반품 관리</ServiceTitle>
              <ServiceText>재고·주문 관리 효율, 반품 처리 최소화</ServiceText>
            </ServiceCard>
            <ServiceCard>
              <ServiceIcon><SecurityIcon fontSize="large" /></ServiceIcon>
              <ServiceTitle>안전 데이터 관리</ServiceTitle>
              <ServiceText>IP 보호, 신뢰성 강화, 불법 유통 차단</ServiceText>
            </ServiceCard>
          </ServicesGrid>
        </GlassBoxStyled>
      </BoxesWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: #fff;
  text-align: center;
`;

const Headline = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 36px;
  }
`;

const BoxesWrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GlassBoxStyled = styled(GlassBox)`
  flex: 1;
  padding: 2rem;
  width: 500px;

  @media (max-width: 1200px) {
    width: 100%;
    max-width: 500px;
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const ServiceCard = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 24px;
  text-align: left;
`;

const ServiceIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const ServiceTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ServiceText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  letter-spacing: -1px;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 6rem;
  display: flex;
  justify-content: center;
`;

export { ServiceSection };
