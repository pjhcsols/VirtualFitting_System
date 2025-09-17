import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";

type InitiateCheckoutSingleButtonProps = {
  onClick?: () => void;
};

function InitiateCheckoutSingleButton({ onClick }: InitiateCheckoutSingleButtonProps) {
  return <Wrapper onClick={onClick}>BUY NOW</Wrapper>;
}

const Wrapper = styled.button`
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

  @media (max-width: ${BREAKPOINTS.lg}px) {
    width: 50%;
  }
`;

export { InitiateCheckoutSingleButton };
