import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const OptionBar = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  & > *:not(:last-child) {
    border-right: 1px solid #121212;
  }
`;

export const Option = styled.div<{ isClicked: boolean }>`
  width: 25%;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  font-size: 0.5rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
  transition: 0.4s background-color ease-out;
  background-color: ${(props) => (props.isClicked ? "#F5F5F5" : "transparent")};
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
`;

export const InfoContentImage = styled.img`
  width: 100%;
`;
