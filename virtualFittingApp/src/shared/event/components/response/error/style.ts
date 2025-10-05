import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px); /* 약간 아래에서 시작 */
  }
  to {
    opacity: 1;
    transform: translateY(0); /* 원래 위치로 이동 */
  }
`;

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 6px 12px;
  width: 120px;
  height: 30px;
  border-radius: 4px;
  background-color: #111111;
  animation: ${fadeInUp} 0.3s ease-out forwards;
  span {
    font-size: 12px;
    font-weight: 500;
    color: white;
  }
`;

export const CheckButton = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 2px;
  background-color: #fffafa;
  span {
    font-size: 10px;
    font-weight: 500;
    color: black;
  }
  transition: 0.2s all ease-out;
  &:hover {
    background-color: #c8c8c8;
  }
`;
