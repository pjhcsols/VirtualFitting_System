import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import { useNavigate } from 'react-router-dom';

type Props = { reviewCount: number; };

export function UserStats({ reviewCount }: Props) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Stat>포인트<Count>0원</Count></Stat>
      <Stat>쿠폰<Count>0개</Count></Stat>
      <Stat onClick={() => navigate("/mypage/review")}>
        후기작성<Count>{reviewCount}개</Count>
      </Stat>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const Count = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: white;
`;