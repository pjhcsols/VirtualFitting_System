import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { CheckoutButton } from '@/features/process-checkout';

interface PaymentSummaryProps {
  totals: {
    productAmount: number;
    finalDiscount: number;
    shippingFee: number;
    totalAmount: number;
  };
  onConfirm: () => void;
}

export const PaymentSummary = ({ totals, onConfirm }: PaymentSummaryProps) => {
  return (
    <StyledGlassBox>
      <Content>
        <Title>결제 금액</Title>
        
        <AmountList>
          <AmountRow>
            <Label>상품 금액</Label>
            <Value>{totals.productAmount.toLocaleString()}원</Value>
          </AmountRow>
          <AmountRow>
            <Label className="discount">할인 금액</Label>
            <Value className="discount">-{totals.finalDiscount.toLocaleString()}원</Value>
          </AmountRow>
          <AmountRow>
            <Label>배송비</Label>
            <Value>{totals.shippingFee > 0 ? `${totals.shippingFee.toLocaleString()}원` : '무료배송'}</Value>
          </AmountRow>
        </AmountList>

        <Divider />
        
        <TotalAmountRow>
          <TotalLabel>총 결제 금액</TotalLabel>
          <TotalValue>{totals.totalAmount.toLocaleString()}원</TotalValue>
        </TotalAmountRow>
        
        <AgreementBox>
          <Checkbox type="checkbox" id="agreement" defaultChecked />
          <AgreementLabel htmlFor="agreement">주문 내용을 확인했으며 결제에 동의합니다.</AgreementLabel>
        </AgreementBox>
        <CheckoutButton
          totalAmount={totals.totalAmount}
          onClick={onConfirm}
        />
      </Content>
    </StyledGlassBox>
  );
};


const StyledGlassBox = styled(GlassBox)`
  width: 100%;
  padding: 0;
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family: "Pretendard", sans-serif;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #fff;
`;

const AmountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const Label = styled.span`
  color: #bbbbbb;

  &.discount { 
    color: #ff8a8a;
  }
`;

const Value = styled.span`
  font-weight: 500;
  color: #fff;

  &.discount { 
    color: #ff8a8a;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 24px 0;
`;

const TotalAmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-weight: 600;
`;

const TotalLabel = styled.span`
  font-size: 18px;
`;

const TotalValue = styled.span`
  font-size: 18px;
`;

const AgreementBox = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  cursor: pointer;
  vertical-align: middle;
  margin: 0;
`;
const AgreementLabel = styled.label`
  color: #bbbbbb;
  cursor: pointer;
`;

