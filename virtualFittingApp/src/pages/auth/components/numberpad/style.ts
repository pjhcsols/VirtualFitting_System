import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`;

export const FlagButtonContainer = styled.div`
  box-sizing: border-box;
  padding: 16px;
  border-radius: 4px;
  border: #111111;
  background-color: #fffafa;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FlagButtonBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const FlagButton = styled.div`
  width: 96px;
  height: 48px;
  border-radius: 4px;
  border: #111111;
`;

export const PhoneInput = styled.input.attrs({ type: "text" })<{
  active: boolean;
}>`
  box-sizing: border-box;
  padding: 16px;
  width: 160px;
  height: 48px;
  border-radius: 4px;
  transition: 0.1s all ease-out;
  border: ${(props) => (props.active ? "#111111" : "#d9d9d9")};
  background-color: #fffafa;
`;
