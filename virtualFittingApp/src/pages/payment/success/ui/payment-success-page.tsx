import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { confirmFinalPayment } from "@/features/process-payment";

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) {
      return;
    }

    const confirm = async () => {
      hasConfirmed.current = true;
      
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      
      const paymentType = sessionStorage.getItem('paymentMethod');

      if (!paymentKey || !orderId || !amount || !paymentType) {
        setError("잘못된 결제 정보입니다. 주문 내역을 확인해주세요.");
        setTimeout(() => navigate('/cart'), 3000);
        return;
      }

      try {
        await confirmFinalPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
          paymentType,
        });

        setIsConfirmed(true);
        
        sessionStorage.removeItem('paymentMethod');
        
        setTimeout(() => {
          navigate('/mypage/order');
        }, 3000);

      } catch (e: any) {
        const errorMessage = e.response?.data?.message || e.message || "알 수 없는 오류 발생";
        setError(errorMessage);
        navigate(`/payment/fail?code=${e.response?.data?.code || 'UNKNOWN'}&message=${encodeURIComponent(errorMessage)}&orderId=${orderId}`);
      }
    };

    confirm();
  }, [searchParams, navigate]);


  if (error) {
    return <Wrapper><StatusText>오류가 발생했습니다. 잠시 후 실패 페이지로 이동합니다...</StatusText></Wrapper>;
  }

  return (
    <Wrapper>
      {isConfirmed ? (
        <ResultBox>
          <SuccessIcon src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" alt="Payment Success"/>
          <Title>결제가 성공적으로 완료되었습니다</Title>
          <InfoText>주문해주셔서 감사합니다.</InfoText>
          <RedirectText>잠시 후 주문 내역 페이지로 이동합니다.</RedirectText>
        </ResultBox>
      ) : (
        <StatusText>결제 승인 중입니다. 잠시만 기다려주세요...</StatusText>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 80px); /* 헤더 높이를 뺀 나머지 영역 */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
`;

const StatusText = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const SuccessIcon = styled.img`
  width: 100px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const RedirectText = styled.p`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

