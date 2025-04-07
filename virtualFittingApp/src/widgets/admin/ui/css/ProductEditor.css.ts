import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 2rem 3rem;
  width: 100%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
`;

export const ButtonContainer = styled.div<{ step: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: -6vh;
  left: 0;
  display: flex;
  justify-content: ${({ step }) => (step === 0 ? "flex-end" : "space-between")};
  align-items: flex-start;
`;

export const NextBtn = styled.div`
  appearance: none;
  background-color: transparent;
  border: 2px solid #1a1a1a;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3b3b3b;
  cursor: pointer;
  display: inline-block;
  font-family: "Pretendard";
  font-size: 16px;
  font-weight: 600;
  color: black;
  line-height: normal;
  margin: 0;
  width: 140px;
  min-height: 45px;
  min-width: 0;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  will-change: transform;
  &:disabled {
    pointer-events: none;
  }
  &:hover {
    color: #fff;
    background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
    transform: translateY(-2px);
  }
  &:active {
    box-shadow: none;
    transform: translateY(0);
  }
`;

export const Divider = styled.div<{ hv: string }>`
  width: 1.5px;
  height: ${(props) => props.hv ?? "100vh"};
  border-radius: 1000px;
  background-color: gray;
`;
