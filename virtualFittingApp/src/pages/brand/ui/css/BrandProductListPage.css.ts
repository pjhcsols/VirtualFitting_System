import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BoldBlueText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #87cefa;
`;

export const BoldText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: black;
`;

export const TextContainer = styled.div`
  min-width: 10rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const ButtonContainer = styled.div`
  min-width: 30rem;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

export const CardContainer = styled.div`
  box-sizing: border-box;
  padding: 2rem 0;
  width: 100%;
  min-width: 50rem;
  min-height: 10rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 2px 2px 2px 0 rgb(234, 234, 234);
`;
