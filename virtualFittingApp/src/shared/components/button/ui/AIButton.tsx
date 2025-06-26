import styled from "styled-components";
import { ICON_AI, IMG_GRADIENT } from "@/shared";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function AIButton() {
  return <AIBtn>
    <IconImage src={ICON_AI} alt={"ai"}/>
    AI 착용하기
    </AIBtn>;
}

const AIBtn = styled.button`
  width: 408px;
  height: 52px;
  border: 1px solid;
  border-image: url(${IMG_GRADIENT}) 50 stretch;
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

  @media (max-width: ${md}px) {
      width: 100%;
    }
`;

const IconImage = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
  object-fit: contain;
`;

export { AIButton };
