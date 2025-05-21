import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  background-color: #fffafa;
`;

export const LogoContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 40%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  align-items: center;
`;

export const InputContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;
