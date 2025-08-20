import { BrandInfoChanger } from "@/widgets";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { BrandUserType } from "../types/brandUser";
import { BasiliumCard } from "@/shared";
import {
  FileInput,
  PretendardText,
  TextInput,
} from "@/shared/components/common";
import { isValidBrandRegistration } from "../api/businessRegisration.action";

function BrandProfile() {
  const [brandInfo, setBrandInfo] = useState<BrandUserType>({
    firmName: "",
    firmWebUrl: "",
    firmAddress: "",
    businessRegistration: "",
  });

  const onChangeBusinessRegisrationName = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setBrandInfo({
      ...brandInfo,
      businessRegistration: e.target.value,
    });
  };

  return (
    <Wrapper>
      <CardContainer>
        <BasiliumCard brandInfo={brandInfo} />
      </CardContainer>
      <ContentContainer>
        <InfoContainer>
          <BrandInfoChanger brandInfo={brandInfo} setBrandInfo={setBrandInfo} />
        </InfoContainer>
        <SettingContainer>
          <BusinessRegistrationContainer>
            <TextInput
              title="사업자 등록증 번호"
              name="businessRegisration"
              value={brandInfo.businessRegistration}
              onChange={onChangeBusinessRegisrationName}
            />
            <BusinessRegistrationTitleBox>
              <PretendardText weight={600} size={"1rem"}>
                사업자 등록증 파일
              </PretendardText>
            </BusinessRegistrationTitleBox>
            <FileInput />
            <SearchBrandRegistrationButton
              isCertified={false}
              name={brandInfo.businessRegistration}
            />
          </BusinessRegistrationContainer>
        </SettingContainer>
      </ContentContainer>
    </Wrapper>
  );
}

export { BrandProfile };

const Wrapper = styled.main`
  box-sizing: border-box;
  position: relative;
  padding: 2rem 8rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
`;

const CardContainer = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.section`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  min-width: 14rem;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const SettingContainer = styled.div`
  position: relative;
  min-width: 14rem;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const BusinessRegistrationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const BusinessRegistrationTitleBox = styled.div`
  margin: 0 0 1rem 0;
  box-sizing: border-box;
  padding: 0 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

interface ISearchButton {
  isCertified: boolean;
  name: string;
}

function SearchBrandRegistrationButton({ isCertified, name }: ISearchButton) {
  const onClick = async () => {
    const res = await isValidBrandRegistration(name);
    if (res) {
      alert("조회를 완료하였습니다!");
    }
  };
  return (
    <ButtonWrapper>
      <Button certified={isCertified} onClick={onClick}>
        <PretendardText weight={600} size={"1rem"} color="black">
          {isCertified ? "인증 완료" : "조회하기"}
        </PretendardText>
      </Button>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 100%;
  min-height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div<{ certified: boolean }>`
  min-width: 28rem;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.certified ? "#45b5f7" : "#d9d9d9")};
  background-color: transparent;
  border-radius: 0.75rem;
  cursor: ${(props) => (props.certified ? "not-allowed" : "pointer")};
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: #d9d9d9;
  }
`;
