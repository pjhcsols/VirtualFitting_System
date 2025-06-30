import { PayButton } from "@/shared";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import type { CartItem } from "@/shared";

type CartItemListProps = {
  cartItems: CartItem[];
  setCartItems?: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function CartPurchaseSummary({ cartItems, setCartItems: _ }: CartItemListProps) {
  const productTotal = cartItems.reduce((acc, item) => {
    const actualPrice = item.discountedPrice ?? item.price;
    return acc + actualPrice * item.quantity;
  }, 0);

  const totalDiscount = cartItems.reduce((acc, item) => {
    if (item.discountedPrice !== undefined) {
      const discount = item.price - item.discountedPrice;
      return acc + discount * item.quantity;
    }
    return acc;
  }, 0);

  const shipping = 3000;
  const total = productTotal + shipping;

  return (
    <Wrapper>
      <CartSummaryContainer>
        <CartSummaryTitle>구매 정보</CartSummaryTitle>
        <PriceInfoList>
          <PriceRow>
            <Label>상품 금액</Label>
            <Value>{(productTotal + totalDiscount).toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>할인 금액</Label>
            <Value>-{totalDiscount.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow>
            <Label>배송비</Label>
            <Value>{shipping.toLocaleString()}원</Value>
          </PriceRow>
          <PriceRow className="total">
            <Label>총 구매 금액</Label>
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