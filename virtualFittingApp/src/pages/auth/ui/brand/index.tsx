import { Basilium3DLogo } from "@/shared";
import { BrandUserBasicInfoWidget } from "../../widgets/brand/basic";
import * as S from "./style";

import { useBrand } from "@/pages/auth/hooks/useBrand";
import { Starfield } from "@/shared/components/star";
import { BrandFirmInfoWidget } from "../../widgets/brand/firm";
import { CheckRegistration } from "../../components/business";

function BrandSignUp() {
  const {
    user,
    prev,
    next,
    step,
    onChangeText,
    onSubmit,
    phone,
    setPhone,
    registration,
    setRegistration,
    firmPhone,
    setFirmPhone,
  } = useBrand();
  return (
    <S.Wrapper>
      <Starfield theme="light" />
      <S.StepInformation>
        <Basilium3DLogo />
      </S.StepInformation>
      <S.ContentCardContainer>
        {step === 0 && (
          <BrandUserBasicInfoWidget
            data={user}
            phone={phone}
            setPhone={setPhone}
            onChangeText={onChangeText}
          />
        )}
        {step === 1 && (
          <BrandFirmInfoWidget
            data={user}
            phone={firmPhone}
            setPhone={setFirmPhone}
            onChangeText={onChangeText}
          />
        )}
        {step === 2 && (
          <CheckRegistration
            registration={registration}
            setRegistration={setRegistration}
          />
        )}
        <S.ButtonContainer>
          <S.NextButton onClick={step === 2 ? onSubmit : next}>
            {step === 2 ? "신청" : "다음"}
          </S.NextButton>
          {step === 0 ? (
            <S.CancelButton to={"/"}>취소</S.CancelButton>
          ) : (
            <S.NextButton onClick={prev}>이전</S.NextButton>
          )}
        </S.ButtonContainer>
      </S.ContentCardContainer>
    </S.Wrapper>
  );
}

export { BrandSignUp };
