import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const IndexText = styled.span<{ clicked: boolean }>`
  font-size: 12px;
  font-weight: 500;
  transition: 0.2s all ease-out;
  color: ${(props) => (props.clicked ? "#111111" : "#d9d9d9")};
  &:hover {
    color: #a8a8a8ff;
  }
`;
