import { Shopping } from "@/shared";
import { useShoppingCartData } from "@/pages";
import styled from "styled-components";
import { xlDouble, xl, lg, md, sm } from "@/shared";
import { CartPurchaseSummary, CartItemList } from "@/widgets";

function ShoppingCartPage() {
  return (
    <Wrapper>
      <Content>
        <CartItemListWrapper>
          <CartItemList />
        </CartItemListWrapper>
        <Divider />
        <CartSummaryWrapper>
          <CartPurchaseSummary />
        </CartSummaryWrapper>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;

  @media (max-width: ${md}px) {
    flex-direction: column;
  }
`;

const Divider = styled.div`
  width: 1px;
  background: #e4e4e4;
  height: 500px;

  @media (max-width: ${md}px) {
    width: 100%;
    background: #e4e4e4;
    height: 1px;
  }
`;


const CartItemListWrapper = styled.div`
  flex: 3;
`;

const CartSummaryWrapper = styled.div`
  flex: 2;
  min-width: 280px;
`;

export { ShoppingCartPage };
