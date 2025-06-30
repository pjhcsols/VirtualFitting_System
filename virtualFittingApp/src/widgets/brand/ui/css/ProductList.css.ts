import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 75vh;
  border-radius: 12px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  background: linear-gradient(to bottom, #292e49, #536976 50%, #bbd2c5 100%);
  box-shadow: 4px 4px 4px 0px #292e49;
  overflow-y: hidden;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  overflow-y: scroll;
`;
