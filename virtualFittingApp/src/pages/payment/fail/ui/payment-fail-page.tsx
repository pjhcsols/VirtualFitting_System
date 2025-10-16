import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GlassButton } from "@/shared/components/glass-button";

export function PaymentFailPage() {
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(window.location.search);
  
  const errorMessage = searchParams.get("message");
  const errorCode = searchParams.get("code");
  // const orderId = searchParams.get("orderId");

  console.log("현재 URL 쿼리:", window.location.search);
  console.log("추출된 에러 메시지:", errorMessage);

  return (
    <Wrapper>
      <ResultBox>
        <Title>결제에 실패했습니다</Title>
        <InfoText>주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.</InfoText>
        
        {!errorMessage && (
          <DebugBox>
            <p>URL Query: <code>{window.location.search || "쿼리 없음"}</code></p>
          </DebugBox>
        )}

        {errorMessage && (
          <ErrorDetails>
            <ErrorCode>에러코드: {errorCode}</ErrorCode>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </ErrorDetails>
        )}
        
        <ButtonContainer>
          <GlassButton size="medium" onClick={() => navigate('/cart')}>
            장바구니로 돌아가기
          </GlassButton>
          <GlassButton size="medium" onClick={() => navigate('/')}>
            홈으로
          </GlassButton>
        </ButtonContainer>
      </ResultBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 500px;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const ErrorDetails = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  border-radius: 8px;
  text-align: left;
  margin-bottom: 1.5rem;
`;

const ErrorCode = styled.p`
  font-size: 0.8rem;
  color: #aaa;
  margin: 0 0 0.5rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 0.9rem;
  color: #ff8a8a;
  margin: 0;
  word-break: keep-all;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const DebugBox = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 0, 0.1);
  border: 1px solid rgba(255, 255, 0, 0.3);
  border-radius: 8px;
  text-align: left;
  margin-bottom: 1.5rem;
  font-size: 14px;
  color: #ffffa0;
  
  code {
    background-color: rgba(0,0,0,0.3);
    padding: 2px 4px;
    border-radius: 4px;
  }
`;

