import { IMG_TEST_CLOTHES } from "@/shared";
import styled from "styled-components";

function Review() {
  return (
    <Wrapper>
      <ReviewContainer>
        <ImageContainer>
          <Image src={IMG_TEST_CLOTHES} alt="test-clothes" />
        </ImageContainer>
        <ReviewContentContainer>
          <ReviewContent>
            기대 많이 안했는데, 생각보다 잘 산 것 같아서 뿌듯했어요.
          </ReviewContent>
        </ReviewContentContainer>
      </ReviewContainer>
    </Wrapper>
  );
}


const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  border-bottom: 1px solid #e4e4e4;
`;

const ReviewContainer = styled.div`
  padding: 20px 0px;
  display: flex;
  flex-flow: row nowrap;
  gap: 16px;
  align-items: flex-start;

`

const ImageContainer = styled.div`
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

const ReviewContentContainer = styled.div`
  display: flex;
  // flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewContent = styled.span`
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  color: black;
`;

export { Review };
