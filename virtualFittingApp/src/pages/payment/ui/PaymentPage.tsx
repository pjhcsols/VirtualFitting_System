import styled from 'styled-components';
import { useProcessPayment } from '@/features/process-payment';

export function PaymentPage() {
  const { isLoading, error } = useProcessPayment();

  if (isLoading) {
    return <Wrapper>결제 정보를 불러오는 중입니다...</Wrapper>;
  }

  if (error) {
    return <Wrapper>결제 처리 중 오류가 발생했습니다: {error.message}</Wrapper>;
  }

  return (
    <Wrapper>
      결제창으로 이동합니다...
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
  color: #555;
  font-size: 1.2rem;
`;