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
  padding: 2rem 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
  }
`;

const Divider = styled.div`
  width: 1px;
  background: #e4e4e4;
  height: 500px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
    background: #e4e4e4;
    height: 1px;
  }
`;


const CartItemListWrapper = styled.div`
  width : 500px;
`;

const CartSummaryWrapper = styled.div`
  flex: 2;
  min-width: 280px;
`;

export { ShoppingCartPage };
