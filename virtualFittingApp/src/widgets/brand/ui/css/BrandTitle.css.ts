import styled from "styled-components";

export const BrandTitleWrapper = styled.div`
  box-sizing: border-box;
  padding: 80px 100px;
  width: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #121212;
  border-radius: 16px;
  box-shadow: 4px 4px 4px 0px rgb(139, 139, 139);
`;

export const BrandProfileBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  overflow: hidden;
`;

export const BrandProfile = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

export const NoBrandProfile = styled.div`
  width: 100px;
  height: 100px;
  background-color: #d9d9d9;
`;

export const BrandTextBox = styled.div`
  width: calc(100%-100px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;
