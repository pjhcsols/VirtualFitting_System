import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
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
  padding: 16px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 16px 16px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Divider = styled.div`
  width: 1px;
  background: #e4e4e4;
  height: auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
    background: #e4e4e4;
    height: 1px;
  }
`;

const CartItemListWrapper = styled.div`
  width: 100%;
  max-width: 500px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 450px;
  }
`;

const CartSummaryWrapper = styled.div`
  width: 100%;
  max-width: 350px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 400px;
  }
`;


export { ShoppingCartPage };
