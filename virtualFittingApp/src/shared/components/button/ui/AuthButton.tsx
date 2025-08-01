import { type MouseEvent } from "react";
import styled from "styled-components";

type ButtonType = {
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

function AuthLoginButton({ onClick }: ButtonType) {
  return (
    <LoginButtonWrapper onClick={onClick}>
      <ButtonText>LOGIN</ButtonText>
    </LoginButtonWrapper>
  );
}

function AuthSignUpButton({ onClick }: ButtonType) {
  return (
    <SignUpButtonWrapper onClick={onClick}>
      <SignUpButtonText>SIGNUP</SignUpButtonText>
    </SignUpButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1000px;
  transition: 0.15s all ease;
  &:hover {
    transform: scale(1.01);
  }
  cursor: pointer;
`;

const ButtonText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
`;

const LoginButtonWrapper = styled(ButtonWrapper)`
  border: 1px solid #d9d9d9;
`;

const SignUpButtonWrapper = styled(ButtonWrapper)`
  background-color: #292e49;
  &:hover {
    background-color: "";
  }
`;

const SignUpButtonText = styled(ButtonText)`
  color: white;
`;

export { AuthLoginButton, AuthSignUpButton };
