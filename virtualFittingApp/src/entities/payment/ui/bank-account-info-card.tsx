import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { GlassButton } from '@/shared/components/glass-button';

const ACCOUNT_INFO = {
  bank: '카카오뱅크',
  number: '3333-31-6854319',
  numberRaw: '3333316854319',
  holder: '바실리움(BASILIUM)',
};

export interface BankAccountInfoCardProps {
  className?: string;
  amountToPay: number;
  senderName: string;
  depositDeadline: string;
}

export const BankAccountInfoCard = ({
  className,
  amountToPay,
  senderName,
  depositDeadline,
}: BankAccountInfoCardProps) => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_INFO.numberRaw);
    //   alert('계좌번호가 복사되었습니다.');
    } catch (err) {
      console.error('계좌번호 복사 실패:', err);
    //   alert('복사에 실패했습니다.');
    }
  };

  const formattedDeadline = new Date(depositDeadline).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' 까지';

  return (
    <GlassBox className={className}>
      <Header>
        <InfoRow>
        <SectionTitle>무통장 입금 정보</SectionTitle>
        <GlassButton onClick={handleCopy} size='small'>
            계좌번호 복사
        </GlassButton>
        </InfoRow>
      </Header>
      <Content>
        <InfoRow>
          <Label>입금 금액</Label>
          <Value>{amountToPay.toLocaleString()}원</Value>
        </InfoRow>
        <InfoRow>
          <Label>은행</Label>
          <Value>{ACCOUNT_INFO.bank}</Value>
        </InfoRow>
        <InfoRow>
          <Label>예금주</Label>
          <Value>{ACCOUNT_INFO.holder}</Value>
        </InfoRow>
        <InfoRow>
          <Label>계좌번호</Label>
          <Value>{ACCOUNT_INFO.number}</Value>
        </InfoRow>
        <InfoRow>
          <Label>송금자명</Label>
          <Value>{senderName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>입금 기한</Label>
          <Value>{formattedDeadline}</Value>
        </InfoRow>
      </Content>
    </GlassBox>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const Content = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Label = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
  width: 60px;
  text-align: left;
`;

const Value = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 500;
  word-break: keep-all;
`;
