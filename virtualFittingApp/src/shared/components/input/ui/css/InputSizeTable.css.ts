import styled from "styled-components";

export const SizeTable = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SizeInput = styled.input`
  width: 20%;
  height: 40px;
  text-align: center;
  background-color: white;
  border: 0.5px solid black;
  font-family: "Pretendard";
  font-size: 16px;
  color: black;
  &:focus {
    outline: none;
  }
`;
