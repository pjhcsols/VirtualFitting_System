import {
  BrandUserCompanySignUpPanel,
  BrandUserSignUp,
  useBrandSignup,
} from "@/widgets";
import styled from "styled-components";

function BrandSignUpPage() {
  const {
    brandUserSignUp,
    step,
    onSubmitSignUp,
    onClickNextStep,
    onClickPrevStep,
    onChangeEmail,
    onChangeId,
    onChangePassword,
    onChangePhoneNumber,
    onChangeFirmAddress,
    onChangeFirmEmail,
    onChangeFirmName,
    onChangeFirmPhoneNumber,
    onChangeFirmWebUrl,
    onClickCancel,
  } = useBrandSignup();
  return (
    <Wrapper>
      <StepInformation>
        <StepText step={step} onClick={onClickPrevStep}>
          회원정보 기입
        </StepText>
        <StepText step={(step + 1) % 2} onClick={onClickNextStep}>
          회사정보 기입
        </StepText>
      </StepInformation>
      {step === 0 && (
        <BrandUserSignUp
          brandUserInfo={brandUserSignUp}
          onChangeEmail={onChangeEmail}
          onChangeId={onChangeId}
          onChangePassword={onChangePassword}
          onChangePhoneNumber={onChangePhoneNumber}
        />
      )}
      {step === 1 && (
        <BrandUserCompanySignUpPanel
          brandUserInfo={brandUserSignUp}
          onChangeFirmAddress={onChangeFirmAddress}
          onChangeFirmEmail={onChangeFirmEmail}
          onChangeFirmName={onChangeFirmName}
          onChangeFirmPhoneNumber={onChangeFirmPhoneNumber}
          onChangeFirmWebUrl={onChangeFirmWebUrl}
        />
      )}
      <ButtonContainer>
        <PrevButton onClick={step === 1 ? onSubmitSignUp : onClickNextStep}>
          {step === 1 ? "신청" : "다음"}
        </PrevButton>
        <NextButton onClick={onClickCancel}>취소</NextButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export { BrandSignUpPage };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 0;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: #fffafa;
`;

const ButtonContainer = styled.div`
  box-sizing: border-box;
  padding: 0.5rem 8rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const DefaultButton = styled.div`
  min-width: 30rem;
  height: 2.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
`;

const NextButton = styled(DefaultButton)`
  border: 1px solid #d9d9d9;
`;

const PrevButton = styled(DefaultButton)`
  border: 1px solid black;
`;

const StepInformation = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 10rem 3rem;
  width: 20rem;
  height: calc(100%-10rem);
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
`;

const StepText = styled.span<{ step: number }>`
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.15s all ease;
  color: ${(props) => (props.step === 0 ? "black" : "#969696")};
`;
