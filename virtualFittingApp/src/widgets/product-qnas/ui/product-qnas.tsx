import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import type { ProductDetail } from '@/entities/product';
import { formatPhoneNumber } from '@/shared/lib/format.util';

interface ProductQnAsProps {
  productId: number;
  product: ProductDetail; 
}

function ProductQnAs({ product }: ProductQnAsProps) { 
  const seller = product.brandUser;

  return (
    <QnAWrapper>
      <QnAHeader>
        <HeaderText>
          판매자 정보
        </HeaderText>
      </QnAHeader>
      <SellerInfoBox>
        <InfoRow>
          <Label>회사명</Label>
          <Value>{seller.firmName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>연락처</Label>
          <Value>{formatPhoneNumber(seller.phoneNumber)}</Value>
        </InfoRow>
        <InfoRow>
          <Label>이메일</Label>
          <Value>{seller.emailAddress}</Value>
        </InfoRow>
        <InfoRow>
          <Label>사업자번호</Label>
          <Value>{seller.businessRegistration}</Value>
        </InfoRow>
        <InfoRow>
          <Label>주소</Label>
          <Value>{seller.firmAddress}</Value>
        </InfoRow>
      </SellerInfoBox>
    </QnAWrapper>
  );
}

const QnAWrapper = styled.div`
  width: 100%;
  padding: 32px 0;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const QnAHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 16px;
`;

const HeaderText = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const SellerInfoBox = styled(GlassBox)`
  width: 100%;
  max-width: 700px;
  margin-left: 16px;
  padding: 24px;
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 4px;
  color: white;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: flex-start; 
  font-size: 14px;
  width: 100%;
`;

const Label = styled.span`
  color: #ffffff;
  flex-basis: 100px;
  flex-shrink: 0;
  text-align: left; 
`;

const Value = styled.span`
  font-weight: 500;
  text-align: left
  word-break: break-all;
`;

export { ProductQnAs };
