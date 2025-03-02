import styled from "styled-components";
import TestClothes from "/img/clothes/top06.jpg";
import { Link } from "react-router-dom";

function AdminProductCard({ id }: { id: string }) {
  return (
    <Wrapper to={`/admin/${id}`}>
      <ImgBox src={TestClothes} alt="test" />
      <InfoContainer>
        <Title>ONE-TUCK WIDE SWEAT PANTS [BLACK]</Title>
        <Content>그냥 옷</Content>
      </InfoContainer>
    </Wrapper>
  );
}

const Wrapper = styled(Link)`
  padding: 1vw 1.2vw;
  width: 15vw;
  height: 20vw;
  display: flex;
  flex-flow: column nowrap;
  border-radius: 12px;
  background: #fff5f5;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  cursor: pointer;
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
  align-items: flex-start;
`;

const Title = styled.p`
  font-family: "Prata-Regular";
  text-align: start;
  font-size: 0.8vw;
  font-weight: 700;
  color: black;
`;

const Content = styled.span`
  font-family: "pretendard";
  font-size: 0.6vw;
  font-weight: 400;
  color: black;
`;

export { AdminProductCard };
