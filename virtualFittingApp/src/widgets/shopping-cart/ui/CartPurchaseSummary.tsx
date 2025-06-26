import { PayButton } from "@/shared";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import type { CartItem } from "@/shared";

type CartItemListProps = {
  cartItems: CartItem[];
  setCartItems?: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function CartPurchaseSummary({ cartItems, setCartItems: _ }: CartItemListProps) {
  // 계산 예시 (임시 하드코딩 or 실제 cartItems 사용 가능)
  const productTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0; // 향후 로직 반영
  const shipping = 3000; // 예시: 배송비
  const total = productTotal - discount + shipping;

  return (
    <Wrapper>
      <CartSummaryContainer>
        <CartSummaryTitle>구매정보</CartSummaryTitle>
        
        <PriceInfoList>
          <PriceRow>
            <Label>상품금액</Label>
            <Value>{productTotal.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>할인금액</Label>
            <Value>{discount.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>배송비</Label>
            <Value>{shipping.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow className="total">
            <Label>총구매금액</Label>
            <Value>{total.toLocaleString()}원</Value>
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
  
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
`;

const CartSummaryContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const CartSummaryTitle = styled.span`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
  width: 100%;
  text-align: left; 
`;

const SizeBoxBottom = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 16px 0px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    justify-content: center;
    align-items: center;
  }
`; 

const PriceInfoList = styled.div`
  width: 100%;
  margin-top: 16px;
  font-family: "pretendard";
  font-size: 16px;
  color: #333;
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