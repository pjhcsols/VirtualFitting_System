import styled from "styled-components";
import { post_shopping_cart } from "../api/button.action";
import { type MouseEvent } from "react";

function ShoppingCartButton({ id }: { id: string }) {
  const onClickButton = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = post_shopping_cart({ productId: id });
  };
  return (
    <ShoppingCartBtn onClick={onClickButton}>장바구니에 담기</ShoppingCartBtn>
  );
}

const ShoppingCartBtn = styled.button`
  width: 32vw;
  min-width: 50px;
  height: 4.5vw;
  min-height: 10px;
  border-radius: 12px;
  background: black;
  font-family: "Studio-Sans";
  font-size: 1vw;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;

export { ShoppingCartButton };
