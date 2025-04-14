import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  .title-box {
    .title {
      font-family: "Pretendard";
      font-size: 1.5rem;
      font-weight: 700;
      color: black;
    }
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
