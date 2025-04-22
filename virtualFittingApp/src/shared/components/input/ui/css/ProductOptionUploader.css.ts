import styled from "styled-components";

export const PalleteContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .dots {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const Pallete = styled.div`
  box-sizing: border-box;
  padding: 12px 24px;
  min-width: 120px;
  width: 140px;
  height: 40px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 4px;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
`;

export const MaterialContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .material-container {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
    .material {
      box-sizing: border-box;
      padding: 12px 20px;
      min-width: 100px;
      height: 32px;
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Pretendard";
      font-size: 1rem;
      font-weight: 600;
      border: 1px solid black;
      color: black;
      cursor: pointer;
    }
  }
`;
