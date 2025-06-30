import { useState, useEffect } from "react";
import type { CartItem } from "@/shared";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { CartPurchaseSummary, CartItemList } from "@/widgets";

function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  return (
    <Wrapper>
      <Content>
        <CartItemListWrapper>
          <CartItemList cartItems={cartItems} setCartItems={setCartItems} />
        </CartItemListWrapper>
        <Divider />
        <CartSummaryWrapper>
          <CartPurchaseSummary cartItems={cartItems} />
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
  min-width : 500px;
`;

const CartSummaryWrapper = styled.div`
  min-width: 300px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    min-width : 400px;
  }
`;

export { ShoppingCartPage };
