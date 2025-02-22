import { IMG_TEST_CLOTHES } from "@/shared/constants";
import styled from "styled-components";

function Review() {
  return (
    <Wrapper>
      <ImageContainer>
        <Image src={IMG_TEST_CLOTHES} alt="test-clothes" />
      </ImageContainer>
      <ReviewContentContainer>
        <ReviewTitle>정말 싸게 잘 산 것 같네요!</ReviewTitle>
        <ReviewContent>
          기대 많이 안했는데, 생각보다 잘 산 것 같아서 뿌듯했어요.
        </ReviewContent>
      </ReviewContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  border-bottom: 0.5px solid #121212;
`;

const ImageContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 6vw;
  height: 9vw;
  object-fit: contain;
`;

const ReviewContentContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewTitle = styled.p`
  font-family: "pretendard";
  font-size: 1.2vw;
  font-weight: 700;
  color: black;
`;

const ReviewContent = styled.span`
  font-family: "pretendard";
  font-size: 0.8vw;
  font-weight: 500;
  color: black;
`;

export { Review };
