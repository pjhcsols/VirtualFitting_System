import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { confirmFinalPayment } from "@/entities/payment/api";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    async function verifyPayment() {
      hasFetched.current = true;

      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const paymentType = 'CARD'; // [seah] 수정해야댐

      if (!paymentKey || !orderId || !amount) {
        setError("잘못된 결제 정보입니다. 주문 내역을 확인해주세요.");
        setLoading(false);
        return;
      }

      try {
        await confirmFinalPayment({ 
          paymentKey,
          orderId,
          amount: Number(amount),
          paymentType,
        });
        
        setTimeout(() => {
          navigate('/mypage/order');
        }, 2000);

      } catch (e: any) {
        if (e.response?.status === 409) {
          console.warn("이미 처리된 결제입니다. 주문 내역 페이지로 이동합니다.");
          setTimeout(() => {
            navigate('/mypage/order');
          }, 2000);
        } else {
          const errorMessage = e.response?.data?.message || e.message || "알 수 없는 오류 발생";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [searchParams, navigate]);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  return (
    <Wrapper>
      {loading && <StatusText>결제 승인 중입니다...</StatusText>}
      
      {error && (
        <ResultBox>
          <Title>결제 실패</Title>
          <InfoText>오류가 발생했습니다.</InfoText>
          <ErrorText>{error}</ErrorText>
        </ResultBox>
      )}

      {!loading && !error && (
        <ResultBox>
          <Title>결제가 성공적으로 완료되었습니다</Title>
          <InfoText>주문해주셔서 감사합니다.</InfoText>
          <InfoGrid>
            <span>주문 아이디</span>
            <span>{orderId}</span>
            <span>결제 금액</span>
            <span>{Number(amount).toLocaleString()}원</span>
          </InfoGrid>
          <RedirectText>2초 후 주문 내역 페이지로 이동합니다.</RedirectText>
        </ResultBox>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
  color: #000;
`;

const StatusText = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const ResultBox = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  background-color: #fafafa;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
`;

const ErrorText = styled.p`
  font-size: 0.9rem;
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.8rem;
  border-radius: 4px;
  word-break: keep-all;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.8rem;
  text-align: left;
  margin: 0 auto;
  max-width: 300px;
  
  span:nth-child(odd) {
    font-weight: 500;
    color: #333;
  }
  
  span:nth-child(even) {
    color: #777;
  }
`;

const RedirectText = styled.p`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #888;
`;

