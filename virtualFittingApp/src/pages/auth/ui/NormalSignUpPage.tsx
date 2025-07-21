import { ConfirmForm, NormalUserSignUp, useNormalSignUp } from "@/widgets";
import gsap from "gsap";
import { useState } from "react";
import styled from "styled-components";

function NormalSignUpPage() {
  const tl = gsap.timeline();

  const [signUpStep, setSignUpStep] = useState<0 | 1 | 2>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const {
    signUpInfo,
    phoneNumber,
    onClickGender,
    onChangePhoneNumber,
    onChangeDatePicker,
    onChange,
    onBlur,
    onSubmitSignUp,
  } = useNormalSignUp(setIsCompleted);

  const onClickNextButton = async () => {
    if (!isCompleted) {
      return;
    }
    if (signUpStep === 0) {
      setSignUpStep(1);
    }
    if (signUpStep === 1) {
      await onSubmitSignUp();
      setSignUpStep(2);
    }
    setIsCompleted(false);
  };

  // step 에 따라, title 과 내용이 변경되는 Animation 적용하려고 함.
  return (
    <Wrapper>
      <TitleContainer>
        <Title></Title>
        <NextButton accepted={isCompleted} onClick={onClickNextButton}>
          {signUpStep === 0 ? "다음" : "가입"}
        </NextButton>
      </TitleContainer>
      {signUpStep === 0 && <ConfirmForm setIsCompleted={setIsCompleted} />}
      {signUpStep === 1 && (
        <NormalUserSignUp
          signUpInfo={signUpInfo}
          phoneNumber={phoneNumber}
          onClickGender={onClickGender}
          onBlur={onBlur}
          onChange={onChange}
          onChangeDatePicker={onChangeDatePicker}
          onChangePhoneNumber={onChangePhoneNumber}
        />
      )}
    </Wrapper>
  );
}

export { NormalSignUpPage };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 25rem;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #fffafa;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: black;
`;

const NextButton = styled.div<{ accepted: boolean }>`
  min-width: 6rem;
  min-height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid #d9d9d9;
  cursor: ${(props) => (props.accepted ? "pointer" : "not-allowed")};
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  transition: 0.15s all ease;
  &:hover {
    transform: scale(1.01);
  }
  &::after {
    transform: scale(0.98);
  }
`;
