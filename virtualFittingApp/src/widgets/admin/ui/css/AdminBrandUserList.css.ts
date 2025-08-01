import styled from "styled-components";

export const UserListContainer = styled.div`
  width: 100%;
  max-height: 50rem;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  translate: gap 0.25s ease-out;
`;

export const Divider = styled.div`
  width: 100%;
  height: 5px;
  background: #121212;
  border-radius: 1000px;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h2`
  color: black;
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
