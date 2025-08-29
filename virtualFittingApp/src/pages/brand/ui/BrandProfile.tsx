import { BrandInfoChanger } from "@/widgets";
import { Dispatch, SetStateAction, useState } from "react";
import styled, { keyframes } from "styled-components";
import { BasiliumCard } from "@/shared";
import {
  FileInput,
  PretendardText,
  TextInput,
} from "@/shared/components/common";
import { useBrandUser } from "../hooks/useBrandUser";

function BrandProfile() {
  const {
    brandUser,
    errMsg,
    isCertified,
    setBrandUser,
    onSubmitFile,
    onFileSelect,
    onSubmitBusinessRegistration,
    onChangeBusinessRegisrationName,
  } = useBrandUser();
  // 1 -> 브랜드 유저 정보 수정
  // 2 -> 사업자 등록증 정보 수정
  const [isClicked, setIsClicked] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);

  return (
    <Wrapper>
      <CardContainer>
        <BasiliumCard brandInfo={brandUser} />
      </CardContainer>
      <BrandProfileHeader isClicked={isClicked} setIsClicked={setIsClicked} />
      <ContentContainer>
        {isClicked === 1 ? (
          <InfoContainer>
            <BrandInfoChanger
              brandInfo={brandUser}
              setBrandInfo={setBrandUser}
            />
          </InfoContainer>
        ) : (
          <SettingContainer>
            <BusinessRegistrationContainer>
              <BusinessRegistrationBox>
                <TextInput
                  type="text"
                  title="사업자 등록증 번호"
                  name="businessRegisration"
                  value={brandUser.businessRegistration}
                  onChange={onChangeBusinessRegisrationName}
                />
                <SearchBrandRegistrationButton
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  isCertified={isCertified.isBusinessRegistrationCerified}
                  onSubmit={onSubmitBusinessRegistration}
                />
              </BusinessRegistrationBox>
              <>
                <BusinessRegistrationTitleBox>
                  <BusinessRegistrationTitleContainer>
                    <PretendardText weight={600} size={"1rem"}>
                      사업자 등록증 파일
                    </PretendardText>
                    <SendCertification
                      isCertified={
                        isCertified.isBusinessRegistrationImageCertified
                      }
                      isLoading={isFileLoading}
                      setIsLoading={setIsFileLoading}
                      onSubmit={onSubmitFile}
                    />
                  </BusinessRegistrationTitleContainer>
                </BusinessRegistrationTitleBox>
                <FileInput onFileSelect={onFileSelect} />
              </>
            </BusinessRegistrationContainer>
          </SettingContainer>
        )}
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
  gap: 2rem;
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
  width: 100%;
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
  align-items: flex-start;
  gap: 1rem;
`;

const BusinessRegistrationBox = styled.div`
  width: 100%;
  min-width: 10rem;
  display: flex;
  flex-flow: row nowrap;
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
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
`;

interface IBrandProfileHeader {
  isClicked: number;
  setIsClicked: Dispatch<SetStateAction<number>>;
}

function BrandProfileHeader({ isClicked, setIsClicked }: IBrandProfileHeader) {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <HeaderBox
          clicked={isClicked === 1}
          onClick={() => {
            setIsClicked(1);
          }}
        >
          <HeaderText>회사 정보 수정</HeaderText>
        </HeaderBox>
      </HeaderContainer>
      <HeaderContainer>
        <HeaderBox
          clicked={isClicked === 2}
          onClick={() => {
            setIsClicked(2);
          }}
        >
          <HeaderText>사업자 등록증 관리</HeaderText>
        </HeaderBox>
      </HeaderContainer>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  min-width: 20rem;
  min-height: 7rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-content: center;
  border: 1px solid #d9d9d9;
`;

const HeaderContainer = styled.div`
  box-sizing: border-box;
  padding: 0.25rem;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderBox = styled.div<{ clicked: boolean }>`
  width: 100%;
  min-height: 7rem;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.15s all ease-out;
  background-color: ${(props) => (props.clicked ? "#e9e9e9" : "transparent")};
  cursor: pointer;
  &:hover {
    background-color: #e9e9e9;
  }
`;

const HeaderText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: black;
`;

interface ISearchButton {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isCertified: boolean;
  onSubmit: () => void;
}

function SearchBrandRegistrationButton({
  isLoading,
  setIsLoading,
  isCertified,
  onSubmit,
}: ISearchButton) {
  const onClick = () => {
    setIsLoading(true);
    onSubmit();
    setIsLoading(false);
  };
  return (
    <ButtonWrapper>
      <Button certified={isCertified} onClick={onClick}>
        {!isLoading ? (
          <PretendardText weight={600} size={"1rem"} color="black">
            {isCertified ? "인증 완료" : "조회하기"}
          </PretendardText>
        ) : (
          <Spinner
            fill="none"
            height="20"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3C6.13401 3 3 6.13401 3 10C3 10.2761 2.77614 10.5 2.5 10.5C2.22386 10.5 2 10.2761 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C9.72386 18 9.5 17.7761 9.5 17.5C9.5 17.2239 9.72386 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3Z"
              fill="#212121"
            />
          </Spinner>
        )}
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
  min-width: 14rem;
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
    background-color: ${(props) =>
      props.certified ? "transparent" : "#d9d9d9"};
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.svg`
  animation: ${spin} 1s linear infinite;
`;

const BusinessRegistrationTitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

interface ISendCertification {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isCertified: number;
  onSubmit: () => void;
}

function SendCertification({
  isLoading,
  setIsLoading,
  isCertified,
  onSubmit,
}: ISendCertification) {
  const onClick = () => {
    setIsLoading(true);
    onSubmit();
    setIsLoading(false);
  };
  return (
    <ButtonWrapper>
      <CertificationButton certified={isCertified} onClick={onClick}>
        {!isLoading ? (
          <PretendardText weight={600} size={"1rem"} color="black">
            {isCertified === 1
              ? "승인 대기"
              : isCertified === 2
                ? "승인 완료"
                : "송신하기"}
          </PretendardText>
        ) : (
          <Spinner
            fill="none"
            height="20"
            viewBox="0 0 20 20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3C6.13401 3 3 6.13401 3 10C3 10.2761 2.77614 10.5 2.5 10.5C2.22386 10.5 2 10.2761 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C9.72386 18 9.5 17.7761 9.5 17.5C9.5 17.2239 9.72386 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3Z"
              fill="#212121"
            />
          </Spinner>
        )}
      </CertificationButton>
    </ButtonWrapper>
  );
}

const CertificationButton = styled.div<{ certified: number }>`
  min-width: 14rem;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${(props) =>
      props.certified === 0
        ? "#d9d9d9"
        : props.certified === 1
          ? "#45b5f7"
          : "#baffbf"};
  background-color: transparent;
  border-radius: 0.75rem;
  cursor: ${(props) => (props.certified === 0 ? "pointer" : "not-allowed")};
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: ${(props) =>
      props.certified === 0
        ? "#d9d9d9"
        : props.certified === 1
          ? "#45b5f7"
          : "#baffbf"};
  }
`;
