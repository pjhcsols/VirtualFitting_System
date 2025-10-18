import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GlassButton } from '@/shared/components/glass-button';
import { BREAKPOINTS } from '@/shared';

export function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <ContentBox>
        <Icon>🚚</Icon>
        {/* <Title>송금 확인 완료</Title> */}
        <Message>
          송금 확인 후 배송이 시작됩니다.
          <br />
          배송이 시작되면 다시 알려드릴게요.
        </Message>
        <ButtonContainer>
          <GlassButton size="medium" width="100%" onClick={() => navigate('/mypage/order')}>
            주문 내역 보기
          </GlassButton>
          <GlassButton size="medium" width="100%" onClick={() => navigate('/products')}>
            쇼핑 계속하기
          </GlassButton>
        </ButtonContainer>
      </ContentBox>
    </Wrapper>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  color: #fff;
`;

const ContentBox = styled.div`
  max-width: 500px;
  width: 100%;
  animation: ${fadeIn} 0.8s ease-in;
`;

const Icon = styled.div`
  font-size: 4rem;
  line-height: 1;
  margin-bottom: 1.5rem;
  animation: ${keyframes`
    0% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    100% { transform: translateX(-5px); }
  `} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    flex-direction: column;
  }
`;
