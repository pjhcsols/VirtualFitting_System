import { Review } from "@/shared";
import styled from "styled-components";

function ReviewContent() {
  return (
    <Wrapper>
      <TitleContainer>
        <ReviewTitle>REVIEW</ReviewTitle>
      </TitleContainer>
      <Review></Review>
      <Review></Review>
      <Review></Review>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReviewTitle = styled.h1`
  padding: 15px 0;
  font-family: "pretendard";
  font-size: 2.5vw;
  font-weight: 700;
  color: black;
`;

export { ReviewContent };
