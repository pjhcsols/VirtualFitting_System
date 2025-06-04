import styled from "styled-components";
import { reviews } from "../constants/dummy";

function Review() {
  return (
    <>
      {reviews.map((review) => (
        <Wrapper key={review.id}>
          <ReviewContainer>
            <ReviewContentContainer>
              <ReviewRatingInfo>⭐ {review.rating}점 | {review.userId}</ReviewRatingInfo>
              <ReviewOption>옵션 : {review.option}</ReviewOption>
              <ReviewBodySize>체형 : {review.height}cm, {review.weight}kg</ReviewBodySize>
              <ReviewSized>사이즈 : {review.size}</ReviewSized>
              <ReviewContent>{review.content}</ReviewContent>
            </ReviewContentContainer>
            <ImageContainer>
              {review.images?.[0] && <Image src={review.images[0]} alt="리뷰 이미지" />}
            </ImageContainer>
          </ReviewContainer>
        </Wrapper>
      ))}
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
`;

const ReviewContainer = styled.div`
  width: 100%;
  padding: 4px;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ReviewContentContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
`;

const ReviewRatingInfo = styled.div`
  font-family: "pretendard";
  font-size: 11px;
  font-weight: 500;
  color: black;
`
const ReviewOption = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  font-weight: 500;
  color: gray;
`
const ReviewBodySize = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  font-weight: 500;
  color: gray;
`
const ReviewSized = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  font-weight: 500;
  color: gray;
`
const ReviewContent = styled.span`
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

export { Review };
