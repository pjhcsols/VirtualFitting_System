import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 120px 40px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
  @media (max-width: 1024px) {
    padding: 120px 100px;
  }
  @media (max-width: 768px) {
    padding: 120px 80px;
  }
  @media (max-width: 688px) {
    padding: 120px 60px;
  }
`;
