import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BACK_ICON } from "@/shared/components/header/constants";
import type { HeaderProps } from "@/shared/components/header/types/header";

function MyHeader({ title, backPath }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath); 
    } else {
      navigate(-1);  
    }
  };

  return (
    <Container1>
      <BackWrapper onClick={handleBack}>
        <BackIcon src={BACK_ICON} alt="뒤로가기" />
      </BackWrapper>
      <ContentInner>
        <Title>{title}</Title>
      </ContentInner>
    </Container1>
  );
}

export { MyHeader };

const Container1 = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #fff;
  border-bottom: 0.5px solid black;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentInner = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackWrapper = styled.div`
  position: absolute;
  left: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const BackIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Title = styled.h1`
  font-family: "Prata-Regular";
  font-size: 1.5em;
  color: #000000;
  cursor: pointer;
`;