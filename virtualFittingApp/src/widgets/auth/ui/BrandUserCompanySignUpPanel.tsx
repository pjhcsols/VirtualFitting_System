import { BREAKPOINTS } from "@/shared";
import styled from "styled-components";
import { BrandUserSignUpRequestDto } from "../types/login";
import { type ChangeEvent } from "react";

type BrandUserCompanySignUpPanelType = {
  brandUserInfo: BrandUserSignUpRequestDto;
  onChangeFirmName: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeFirmAddress: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeFirmWebUrl: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeFirmEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeFirmPhoneNumber: (e: ChangeEvent<HTMLInputElement>) => void;
};

function BrandUserCompanySignUpPanel({
  brandUserInfo,
  onChangeFirmName,
  onChangeFirmAddress,
  onChangeFirmEmail,
  onChangeFirmPhoneNumber,
  onChangeFirmWebUrl,
}: BrandUserCompanySignUpPanelType) {
  return (
    <Wrapper>
      <InfoContainer>
        <TitleContainer>
          <Title>BASILIUM BRAND 회사정보</Title>
        </TitleContainer>
        <InfoBox>
          <SubTitle>회사 명</SubTitle>
          <TextInput
            value={brandUserInfo.firmName}
            onChange={onChangeFirmName}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>회사 주소</SubTitle>
          <TextInput
            value={brandUserInfo.firmAddress}
            onChange={onChangeFirmAddress}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>회사 WebSite URL</SubTitle>
          <TextInput
            value={brandUserInfo.firmWebUrl}
            onChange={onChangeFirmWebUrl}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>회사 EMAIL</SubTitle>
          <TextInput
            value={brandUserInfo.firmEmail}
            onChange={onChangeFirmEmail}
          />
        </InfoBox>
        <InfoBox>
          <SubTitle>회사 전화번호</SubTitle>
          <TextInput
            value={brandUserInfo.firmPhone}
            onChange={onChangeFirmPhoneNumber}
          />
        </InfoBox>
      </InfoContainer>
    </Wrapper>
  );
}

export { BrandUserCompanySignUpPanel };

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
