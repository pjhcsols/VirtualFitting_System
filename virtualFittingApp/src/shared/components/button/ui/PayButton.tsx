import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";

function PayButton() {
  return <PayBtn>
    결제하기
    </PayBtn>;
}

const PayBtn = styled.button`
  width: 100%;
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

  // @media (max-width: ${BREAKPOINTS.md}px) {
  //     width: 50%;
  //   }
`;

export { PayButton };
