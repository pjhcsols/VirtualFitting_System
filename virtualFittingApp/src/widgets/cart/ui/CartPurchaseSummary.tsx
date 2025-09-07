import { PayButton } from "@/shared";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { useRecoilValue } from 'recoil';
import { cartTotalsState } from '@/entities';

function CartPurchaseSummary() {
  const totals = useRecoilValue(cartTotalsState);

  return (
    <Wrapper>
      <CartSummaryContainer>
        <CartSummaryTitle>구매 정보</CartSummaryTitle>
        <PriceInfoList>
          <PriceRow>
            <Label>상품 금액</Label>
            <Value>{totals.originalTotal.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>할인 금액</Label>
            <Value>-{totals.totalDiscount.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>배송비</Label>
            <Value>{totals.shippingFee.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow className="total">
            <Label>총 구매 금액</Label>
            <Value>{totals.total.toLocaleString()}원</Value>
          </PriceRow>
        </PriceInfoList>
        <SizeBoxBottom>
          <PayButton />
        </SizeBoxBottom>
      </CartSummaryContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CartSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CartSummaryTitle = styled.span`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
`;

const SizeBoxBottom = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 16px 0px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    min-width : 400px;
  }
`; 

const PriceInfoList = styled.div`
  min-width: 350px;
  margin-top: 16px;
  font-family: "pretendard";
  font-size: 16px;
  color: #333;

  @media (max-width: ${BREAKPOINTS.md}px) {
    min-width : 400px;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &.total {
    font-weight: 700;
    font-size: 18px;
    margin-top: 12px;
    border-top: 1px solid #ddd;
    padding-top: 12px;
  }
`;

const Label = styled.span``;
const Value = styled.span``;

export { CartPurchaseSummary };