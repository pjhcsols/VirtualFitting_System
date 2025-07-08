import styled from "styled-components";

export const CardContainer = styled.div`
  box-sizing: border-box;
  padding: 2rem;
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

export const NoDataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: black;
  }
`;

export const NoDataIcon = styled.img`
  max-width: 12rem;
  max-height: 12rem;
  object-fit: contain;
`;
