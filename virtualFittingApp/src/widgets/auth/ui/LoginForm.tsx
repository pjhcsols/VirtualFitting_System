import { useLogin } from "../hooks/useLogin";
import styled from "styled-components";
import {
  AuthLoginButton,
  AuthSignUpButton,
  LoginInput,
  PasswordInput,
} from "@/shared";

function LoginForm() {
  const {
    loginInfo,
    onChangeUserId,
    onChangeUserPassword,
    onClickSignUp,
    onSubmitLoginInfo,
  } = useLogin();
  return (
    <Wrapper>
      <Title>BASILIUM</Title>
      <SubTitle>BASILIUM 로그인입니다</SubTitle>
      <InfoContainer>
        <LoginInput value={loginInfo.userId} onChange={onChangeUserId} />
        <PasswordInput
          value={loginInfo.userPassword}
          onChange={onChangeUserPassword}
        />
      </InfoContainer>
      <Divider />
      <ButtonContainer>
        <AuthLoginButton onClick={onSubmitLoginInfo} />
        <AuthSignUpButton onClick={onClickSignUp} />
      </ButtonContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 7rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: black;
`;

const SubTitle = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: black;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 16px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 1000px;
  background-color: #d9d9d9;
`;

export { LoginForm };
