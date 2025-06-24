import { useState } from "react";
import styled from "styled-components";
import { xlDouble, xl, lg, md, sm } from "@/shared";
import { PopUpBottom } from "@/shared";

function AddButton() {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
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
