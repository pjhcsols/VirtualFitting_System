import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.form`
  box-sizing: border-box;
  padding: 5rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 0px 0px rgba(255, 255, 255, 0);
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.8),
      transparent,
      rgba(255, 255, 255, 0.3)
    );
  }
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fffafa;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 16px;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 1000px;
  background-color: #d9d9d9;
`;

export const IdInput = styled.input.attrs({ type: "text" })`
  box-sizing: border-box;
  padding: 0.75rem 2rem 0.75rem 1rem;
  width: 100%;
  border: 1px solid #fffafa;
  border-radius: 8px;
  background-color: transparent;
  font-size: 0.75rem;
  font-weight: 400;
  color: white;
  &:focus {
    outline: none;
  }
`;

export const PasswordInput = styled(IdInput).attrs({ type: "password" })``;

export const BrandSignUpButton = styled.div`
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
  border: 1px solid #bbd2c5;
  background-color: #bbd2c5;
`;

export const LoginButton = styled.button.attrs({ type: "submit" })`
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
  border: 1px solid #d9d9d9;
`;

export const SignUpButton = styled(NavLink)`
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1000px;
  transition: 0.15s all ease;
  cursor: pointer;
  background-color: #292e49;
  &:hover {
    transform: scale(1.01);
    background-color: "";
  }
  span {
    color: white;
  }
`;

export const SignUpButtonWrapper = styled(NavLink)`
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
  background-color: #292e49;
`;

export const ButtonText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
`;

export const LoginButtonWrapper = styled.div`
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
  border: 1px solid #d9d9d9;
`;

export const SignUpText = styled(ButtonText)`
  color: white;
`;
