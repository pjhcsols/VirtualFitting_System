import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import icon_ai from "../assets/icon-ai.svg"
import gradient_ai from "../assets/gradient-ai.png";

function AITryOnButton() {
  return <Wrapper>
    <Icon src={icon_ai} alt={"ai"}/>
    AI 착용하기
    </Wrapper>;
}

const Wrapper = styled.button`
  width: 408px;
  height: 52px;
  border: 1px solid;
  border-image: url(${gradient_ai}) 50 stretch;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  color: black;
  background: white;
  flex-direction: row;

  @media (max-width: ${BREAKPOINTS.lg}px) {
      width: 100%;
    }
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
  object-fit: contain;
`;

export { AITryOnButton };
