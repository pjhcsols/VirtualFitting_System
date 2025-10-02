import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { cartState, cartTotalsState } from '@/entities/cart';
import { GlassButton } from '@/shared/components/glass-button';
import { GlassBox } from '@/shared/components/glass-box';
import { useNavigate } from 'react-router-dom';

function CartPurchaseSummary() {
  const totals = useRecoilValue(cartTotalsState);
  const cartItems = useRecoilValue(cartState);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }
    // 장바구니에 담긴 모든 아이템을 state로 전달하며 checkout 페이지로 이동
    navigate('/payment', { state: { items: cartItems } });
  };

  return (
    <StyledGlassBox>
      <Content>
        <Title>결제 금액</Title>
        
        <AmountList>
          <AmountRow>
            <Label>상품 금액</Label>
            <Value>{totals.originalSubtotal.toLocaleString()}원</Value>
          </AmountRow>
          <AmountRow>
            <Label className="discount">할인 금액</Label>
            <Value className="discount">-{totals.totalDiscount.toLocaleString()}원</Value>
          </AmountRow>
          <AmountRow>
            <Label>배송비</Label>
            <Value>{totals.shippingFee > 0 ? `${totals.shippingFee.toLocaleString()}원` : '무료배송'}</Value>
          </AmountRow>
        </AmountList>

        <Divider />
        
        <TotalAmountRow>
          <TotalLabel>총 결제 금액</TotalLabel>
          <TotalValue>{totals.total.toLocaleString()}원</TotalValue>
        </TotalAmountRow>
        
        <AgreementBox>
          <Checkbox type="checkbox" id="cart-agreement" defaultChecked />
          <AgreementLabel htmlFor="cart-agreement">주문 내용을 확인했으며 결제에 동의합니다.</AgreementLabel>
        </AgreementBox>

        {/* InitiateCheckoutCartButton 대신 GlassButton을 직접 사용 */}
        <GlassButton
          size="large"
          width="100%"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          주문하기
        </GlassButton>
      </Content>
    </StyledGlassBox>
  );
};


// --- Styled Components (PaymentSummary와 동일한 스타일) ---

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
  gap: 16px; /* 간격 조정 */
`;

const AmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px; /* 폰트 크기 통일 */
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
  font-weight: 700; /* 굵기 통일 */
`;

const TotalLabel = styled.span`
  font-size: 18px;
`;

const TotalValue = styled.span`
  font-size: 22px; /* 총 결제 금액 강조 */
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

export { CartPurchaseSummary };