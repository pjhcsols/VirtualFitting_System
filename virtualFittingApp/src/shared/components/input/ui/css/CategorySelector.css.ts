import styled from "styled-components";

export const Box = styled.div<{ isClicked: boolean }>`
  width: 140px;
  height: 50px;
  border: 1px solid #121212;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: 0.25s all ease-out;
  cursor: pointer;
  .dot {
    background-color: transparent;
  }
  .text {
    font-family: "Pretendard";
    font-size: 1rem;
    font-weight: 600;
    color: black;
  }
`;

export const ViewBox = styled(Box)`
  background: ${(props) => (props.isClicked ? "#121212" : "white")};
  .dot {
    background: ${(props) => (props.isClicked ? "#121212" : "none")};
  }
  .text {
    font-family: "Pretendard";
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => (props.isClicked ? "white" : "black")};
  }
`;
