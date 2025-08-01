import { BREAKPOINTS } from "@/shared";
import styled from "styled-components";
import { BrandUserSignUpRequestDto } from "../types/login";
import { type ChangeEvent } from "react";

type BrandUserSignUpPanelType = {
  brandUserInfo: BrandUserSignUpRequestDto;
  onChangeId: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePhoneNumber: (e: ChangeEvent<HTMLInputElement>) => void;
};

function BrandUserSignUp({
  brandUserInfo,
  onChangeId,
  onChangePassword,
  onChangeEmail,
  onChangePhoneNumber,
}: BrandUserSignUpPanelType) {
  return (
    <Wrapper>
      <InfoContainer>
        <TitleContainer>
          <Title>BASILIUM BRAND 기본정보</Title>
        </TitleContainer>
        <InfoBox>
          <SubTitle>ID</SubTitle>
          <TextInput value={brandUserInfo.id} onChange={onChangeId} />
        </InfoBox>
        <InfoBox>
          <SubTitle>PASSWORD</SubTitle>
          <PasswordInput
            value={brandUserInfo.password}
            onChange={onChangePassword}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>EMAIL</SubTitle>
          <TextInput
            value={brandUserInfo.emailAddress}
            onChange={onChangeEmail}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>PHONE-NUMBER</SubTitle>
          <TextInput
            value={brandUserInfo.phoneNumber}
            onChange={onChangePhoneNumber}
          />
        </InfoBox>
      </InfoContainer>
    </Wrapper>
  );
}

export { BrandUserSignUp };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 20rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  @media (max-width: ${BREAKPOINTS.xl}px) {
    padding: 1rem 15rem;
  }
  @media (max-width: ${BREAKPOINTS.lg}px) {
    padding: 1rem 10rem;
  }
  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 1rem 5rem;
  }
  @media (max-width: ${BREAKPOINTS.sm}px) {
    padding: 1rem 2.5rem;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
`;

const InfoContainer = styled.div`
  box-sizing: border-box;
  padding: 1rem 10rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const InfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.75rem;
`;

const SubTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;

const TextInput = styled.input.attrs({ type: "text" })`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 2rem;
  width: 100%;
  height: 2.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 2px solid #ededed;
  border-radius: 1rem;
  background-color: transparent;
  &:focus {
    outline: 1px solid #121519;
  }
`;

const PasswordInput = styled.input`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 2rem;
  width: 100%;
  height: 2.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 2px solid #ededed;
  border-radius: 1rem;
  background-color: transparent;
  &:focus {
    outline: 1px solid #121519;
  }
`;
