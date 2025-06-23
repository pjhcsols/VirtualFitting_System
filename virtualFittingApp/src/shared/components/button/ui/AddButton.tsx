import styled from "styled-components";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function AddButton() {
  return <AddBtn>
    장바구니
    </AddBtn>;
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
`
export { AddButton };