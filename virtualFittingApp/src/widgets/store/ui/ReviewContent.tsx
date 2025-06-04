import { Review } from "@/shared";
import styled from "styled-components";

function ReviewContent() {
  return (
    <Wrapper>
      <ReviewContainer>
        <ReviewTitle>리뷰</ReviewTitle>
      </ReviewContainer>
      <Review></Review>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const ReviewTitle = styled.h1`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
`;

export { ReviewContent };
