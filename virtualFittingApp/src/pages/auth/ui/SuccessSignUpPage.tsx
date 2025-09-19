import { Link } from "react-router-dom";
import styled from "styled-components";

function SuccessSignUpPage() {
  return (
    <Wrapper>
      <Title>BASILIUM 회원가입을 축하합니다 🍾</Title>
      <SubTitle>감사합니다.</SubTitle>
      <ButtonContainer>
        <Button to={"/login"}>로그인하기</Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export { SuccessSignUpPage };

const Wrapper = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: black;
`;

const SubTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const Button = styled(Link)`
  min-width: 7rem;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
`;
