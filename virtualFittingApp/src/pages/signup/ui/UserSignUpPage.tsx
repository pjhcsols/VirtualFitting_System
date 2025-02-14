import { ChangeEvent, useState } from "react";
import styled, { keyframes } from "styled-components";
import { UserSignUpType } from "../types/signup";
import { checkPassword } from "../utils/checker.util";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function UserSignUpPage() {
  const router = useNavigate();
  const [userInfo, setUserInfo] = useState<UserSignUpType>({
    id: 0,
    birthDate: "",
    detailAddress: "",
    emailAddress: "",
    loginType: "",
    name: "",
    password: "",
    passwordCheck: "",
    phoneNumber: "",
    roadAddress: "",
    userGrade: "BRONZE",
    userImageUrl: "",
    userNumber: 0,
    zipCode: "",
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      const isValidPassword = checkPassword(value);
      setUserInfo({
        ...userInfo,
        password:
          isValidPassword ??
          "영어 소문자, 대문자, 특수문자 1개 이상 포함, 8자 이상이어야 합니다.",
      });
    } else {
      setUserInfo({
        ...userInfo,
        [name]: value,
      });
    }
  };

  return (
    <Wrapper>
      <LogoContainer>
        <LogoTitle>Basilium</LogoTitle>
      </LogoContainer>
      <InputContainer>
        <InputBox>
          <InputLabel htmlFor="emailAddress">Email</InputLabel>
          <TextInput
            type="text"
            id="emailAddress"
            name="emailAddress"
            onChange={onChangeInput}
            placeholder="Enter Your Email"
            required
          />
        </InputBox>
        <InputBox>
          <InputLabel htmlFor="emailAddress">Password</InputLabel>
          <TextInput
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            onChange={onChangeInput}
            required
          />
        </InputBox>
        <InputBox>
          <InputLabel htmlFor="emailAddress">PasswordCheck</InputLabel>
          <TextInput
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            placeholder="Enter Your Password Again"
            onChange={onChangeInput}
            required
          />
        </InputBox>
        <StepButton to={"/signup/1"}>Sign Up</StepButton>
      </InputContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoContainer = styled.div`
  padding: 40px 100px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const LogoTitle = styled(motion.h1)`
  font-size: 2em;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
`;

const InputContainer = styled.div`
  padding: 40px 100px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const InputBox = styled.div`
  width: 100%;
  gap: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const InputLabel = styled.label`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const TextInput = styled.input`
  padding: 8px 18px;
  min-width: 320px;
  width: 80%;
  height: 24px;
  border-radius: 1000px;
  background: white;
  color: black;
`;

const StepButton = styled(Link)`
  min-width: 320px;
  width: 80%;
  height: 36px;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  color: white;
  transition: 0.15s all ease-out;
`;

export { UserSignUpPage };
