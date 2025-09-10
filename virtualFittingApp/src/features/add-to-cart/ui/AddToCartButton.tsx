import { useState } from "react";
import styled from "styled-components";
import { PopUpBottom } from "@/shared/ui/PopUpBottom";
import { BREAKPOINTS } from "@/shared";

type AddToCartButtonProps = {
  onClick: () => void;
};

function AddToCartButton({ onClick }: AddToCartButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    onClick();
    
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <>
      <Wrapper onClick={handleClick}>ADD</Wrapper>
      {showPopup && <PopUpBottom message="장바구니에 상품을 담았습니다." />}
    </>
  );
}

const Wrapper = styled.button`
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
  transition: all 0.2s;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    width: 50%;
  }
`;

export { AddToCartButton };