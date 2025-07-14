import styled from "styled-components";
import { BrandUserIcon, NormalUserIcon } from "@/shared";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPanel() {
  const router = useNavigate();
  const [isNormal, setIsNormal] = useState<-1 | 0 | 1>(0);

  const onClickNormalUser = () => {
    if (isNormal === 1) {
      setIsNormal(0);
    } else {
      setIsNormal(1);
    }
  };

  const onClickBrandUser = () => {
    if (isNormal === -1) {
      setIsNormal(0);
    } else {
      setIsNormal(-1);
    }
  };

  const onClickNextBtn = () => {
    if (isNormal === 1) {
      router("/signup/normal");
    } else if (isNormal === -1) {
      router("/signup/brand");
    }
  };

  const tl = gsap.timeline();

  useEffect(() => {
    tl.fromTo(
      ".title",
      {
        opacity: 0,
        y: -20,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
        ease: "power3.out",
      },
    );
    tl.fromTo(
      ".icon",
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.1,
        ease: "power4.out",
      },
    );
  }, []);

  return (
    <Wrapper>
      <TitleContainer>
        <Title className="title">회원가입</Title>
      </TitleContainer>
      <InfoContainer>
        <ButtonContainer>
          <NormalUserIconBox
            className="icon"
            clicked={isNormal}
            onClick={onClickNormalUser}
          >
            <NormalUserIcon width="60px" height="60px" fill="black" />
            <Text>일반</Text>
          </NormalUserIconBox>
          <BrandUserIconBox
            className="icon"
            clicked={isNormal}
            onClick={onClickBrandUser}
          >
            <BrandUserIcon width="60px" height="60px" fill="black" />
            <Text>Brand</Text>
          </BrandUserIconBox>
        </ButtonContainer>
      </InfoContainer>
      <NextButton onClick={onClickNextBtn}>
        <Text>회원가입 진행</Text>
      </NextButton>
    </Wrapper>
  );
}

export { SignupPanel };

const Wrapper = styled.form`
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: black;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NormalUserIconBox = styled.div<{ clicked: -1 | 0 | 1 }>`
  width: 6rem;
  height: 6rem;
  border-radius: 8px;
  border: ${(props) =>
    props.clicked === 1 ? "2px solid #121519" : "1px solid #121519"};
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  transition: 0.1s all ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const BrandUserIconBox = styled(NormalUserIconBox)`
  border: ${(props) =>
    props.clicked === -1 ? "2px solid #121519" : "1px solid #121519"};
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rem;
`;

const Text = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;

const NextButton = styled.div`
  width: 20rem;
  height: 3rem;
  border: 1px solid #121519;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s all ease;
  &:hover {
    transform: scale(1.01);
  }
`;
