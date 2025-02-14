import styled from "styled-components";
import TestClothes from "/img/clothes/top06.jpg";

function AdminProductCard() {
  return (
    <Wrapper>
      <ImgBox src={TestClothes} alt="test" />
      <InfoContainer>
        <Title>옷</Title>
        <Content>그냥 옷</Content>
      </InfoContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 10em;
  height: 15em;
  border-radius: 12px;
  border: 1px solid #121212;
`;

const ImgBox = styled.img`
  width: 100%;
  height: 50%;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;
  width: 100%;
  height: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 0.8em;
  color: black;
`;

const Content = styled.span`
  font-size: 0.4em;
  color: black;
`;

export { AdminProductCard };
