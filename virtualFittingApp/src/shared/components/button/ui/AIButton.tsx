import styled from "styled-components";
import { ICON_AI } from "@/shared";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function AIButton() {
  return <AIBtn>
    <IconImage src={ICON_AI} alt={"ai"}/>
    AI 착용하기
    </AIBtn>;
}

const AIBtn = styled.button`
  width: 200px;
  height: 52px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 16px;
  cursor: pointer;
  color: black;
  background: white;
  flex-direction: row;

  @media (max-width: ${md}px) {
      width: 50%;
    }
`;

const IconImage = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
  object-fit: contain;
`;

export { AIButton };
