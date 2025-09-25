import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  min-width: 328px;
  min-height: 632px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border: 1px solid #c8c8c8;
  border-radius: 8px;
  background-color: #fffafa;
  transition: 0.2s all ease-out;
  &:hover {
    transform: scale(1.01);
    background-color: #d9d9d9;
  }
`;

export const ProductTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
`;
