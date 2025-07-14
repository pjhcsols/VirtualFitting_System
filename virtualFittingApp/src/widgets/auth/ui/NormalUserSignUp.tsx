import { useNormalSignUp } from "../hooks/useNormalSignup";
import styled from "styled-components";
import {
  AddressInput,
  BirthdayInput,
  EmailAddressInput,
  IDInput,
  NameInput,
  NickNameInput,
  PasswordInput,
  PhoneNumberInput,
} from "@/shared";

function NormalUserSignUp() {
  const { signUpInfo, onChange, onClickHome, onSubmitSignUp } =
    useNormalSignUp();
  return (
    <Wrapper>
      <TitleContainer>
        <TItle>일반 사용자 회원가입</TItle>
      </TitleContainer>
      <InfoContainer>
        <IDInput value={signUpInfo.id} onChange={onChange} />
        <PasswordInput value={signUpInfo.password} onChange={onChange} />
        <EmailAddressInput
          value={signUpInfo.emailAddress}
          onChange={onChange}
        />
        <NameInput value={signUpInfo.name} onChange={onChange} />
        <NickNameInput value={signUpInfo.nickname} onChange={onChange} />
        <AddressInput value={signUpInfo.address} onChange={onChange} />
        <PhoneNumberInput value={signUpInfo.phoneNumber} onChange={onChange} />
        <BirthdayInput value={signUpInfo.birthDate} onChange={onChange} />
      </InfoContainer>
      <ButtonContainer onClick={onSubmitSignUp}>
        <Button>
          <Text>회원가입</Text>
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export { NormalUserSignUp };

const Wrapper = styled.section`
  box-sizing: border-box;
  padding: 7rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TItle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: black;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div`
  width: 15rem;
  height: 3rem;
  border: 1px solid #121519;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s all ease;
  &:hover {
    transform: scale(1.01);
  }
`;

const Text = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: black;
`;
