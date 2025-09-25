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

export const TextContainer = styled.span`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const BlueText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #017cd3ff;
`;

export const BlackText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: black;
`;

export const PostHeaderColumn = styled.header`
  box-sizing: border-box;
  padding: 16px 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
`;

export const PostHeaderBox = styled.div`
  width: 20%;
  height: 60px;
`;

export const PostHeaderText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: black;
`;

export const BrandUserColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
`;
