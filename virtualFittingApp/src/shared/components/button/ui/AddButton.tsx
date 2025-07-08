import { useState } from "react";
import styled from "styled-components";
import { md } from "@/shared";
import { PopUpBottom } from "@/shared";
import type { CartItem } from "@/shared";

function AddButton({ product }: { product: CartItem }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    const storedCart = localStorage.getItem("cart");
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart).filter((item: CartItem | null) => item !== null): [];

    const productToAdd = { ...product, quantity: product.quantity ?? 1 };

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === productToAdd.id &&
        item.color === productToAdd.color &&
        item.size === productToAdd.size
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += productToAdd.quantity;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <>
      <AddBtn onClick={handleClick}>ADD</AddBtn>
      {showPopup && <PopUpBottom message="장바구니에 상품을 담았습니다." />}
    </>
  );
}


const AddBtn = styled.div`
  width: 200px;
  height: 50px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  background: white;
  color: black;

  @media (max-width: ${md}px) {
    width: 50%;
  }
`;

export { AddButton };
