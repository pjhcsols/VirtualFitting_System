import { BREAKPOINTS } from "@/shared";
import styled from "styled-components";
import { BrandUserSignUpRequestDto } from "../types/login";
import { useState, type ChangeEvent } from "react";
import { PhoneNumberInput } from "@/shared/components/common";

type BrandUserSignUpPanelType = {
  brandUserInfo: BrandUserSignUpRequestDto;
  onChangeId: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePhoneNumber: (value: string) => void;
};

function BrandUserSignUp({
  brandUserInfo,
  onChangeId,
  onChangePassword,
  onChangeEmail,
  onChangePhoneNumber,
}: BrandUserSignUpPanelType) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

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
            type={showPassword ? "text" : "password"}
            value={brandUserInfo.password}
            onChange={onChangePassword}
          />
          <ToggleButton
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <EyeIcon
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showPassword ? (
                // 눈 감은 아이콘
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.93-6.93a2.99 2.99 0 0 0-4.17-.11L9.9 4.24z" />
                </>
              ) : (
                // 눈 뜬 아이콘
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </EyeIcon>
          </ToggleButton>
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
          <PhoneNumberInput
            name="phone-number"
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
  position: relative;
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

const ToggleButton = styled.button`
  position: absolute;
  top: 2.3rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #667eea;
  }

  &:focus {
    outline: none;
    color: #667eea;
  }
`;

const EyeIcon = styled.svg`
  width: 20px;
  height: 20px;
  transition: opacity 0.2s ease;
`;
