import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 10rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

export const CountContainer = styled.div`
  min-width: 324px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

// * Banner Column
// * ======================================
export const HeaderColumn = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  gap: 10rem;
`;

export const ColumnWrapper = styled.div`
  box-sizing: border-box;
  padding: 0 1rem;
  margin: 1rem 0;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #d9d9d9;
`;

export const ColumnBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ColumnText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: black;
`;

export const Text = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

export const ButtonBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: 0.2s all ease-out;
  &:hover {
    background-color: #d9d9d9;
  }
`;

export const PlusButton = styled.div`
  box-sizing: border-box;
  padding: 0 16px;
  min-width: 128px;
  min-height: 40px;
  display: flex;
  flex-flow: row nowrap;
  justify-items: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #91c1f9ff;
  transition: 0.2s all ease-out;
  gap: 12px;
  &:hover {
    transform: scale(1.02);
    background-color: #80bafdff;
  }
`;

export const WhiteText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: white;
`;

export const NoDisplayFileInput = styled.input.attrs({ type: "file" })`
  display: none;
`;
