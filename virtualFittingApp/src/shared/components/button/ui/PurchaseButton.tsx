import styled from "styled-components";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function PurchaseButton() {
  return <PurchaseBtn>
    BUY
    </PurchaseBtn>;
}

const PurchaseBtn = styled.button`
  width: 200px;
  height: 52px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  color: white;
  background: black;
  flex-direction: row;

  @media (max-width: ${md}px) {
      width: 50%;
    }
`;

export { PurchaseButton };
