import styled from "styled-components";

export const Wrapper = styled.div`
  z-index: 10;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const FileUploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  .show-text {
    font-size: 1rem;
    color: black;
  }
`;

export const FileBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const TitleText = styled.span`
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-weight: 600;
  color: black;
`;

export const SizeTableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export const AddButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export const CategoryBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

export const SizeTable = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > *:not(:last-child) {
    border-right: 0.5px solid #d9d9d9;
  }
  div {
    width: 20%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-bottom: 0.5px solid #d9d9d9;
    font-family: "Pretendard";
    font-size: 16px;
    color: black;
  }
`;

export const SizeContentTable = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
`;
