import { Starfield } from "@/shared/components/star";
import * as S from "./style";
import { Basilium3DLogo } from "@/shared";
import { NormalUserSignUpWidget } from "../../widgets/normal";
import { useNormal } from "../../hooks/useNormal";
import { NormalUserSecondWidget } from "../../widgets/normal/second";

function NormalSignUpPage() {
  const {
    user,
    prev,
    next,
    step,
    onChangeText,
    phone,
    setPhone,
    birthday,
    setBirthday,
    onSubmit,
  } = useNormal();
  return (
    <S.Wrapper>
      <Starfield theme="light" />
      <S.StepInformation>
        <Basilium3DLogo />
      </S.StepInformation>
      <S.ContentCardContainer>
        {step === 1 ? (
          <NormalUserSignUpWidget
            data={user}
            onChange={onChangeText}
            phone={phone}
            setPhone={setPhone}
          />
        ) : (
          <NormalUserSecondWidget
            data={user}
            onChange={onChangeText}
            birthday={birthday}
            setBirthday={setBirthday}
          />
        )}
        <S.ButtonContainer>
          <S.NextButton onClick={step === 2 ? onSubmit : next}>
            {step === 2 ? "신청" : "다음"}
          </S.NextButton>
          {step === 1 ? (
            <S.CancelButton to={"/"}>취소</S.CancelButton>
          ) : (
            <S.NextButton onClick={prev}>이전</S.NextButton>
          )}
        </S.ButtonContainer>
      </S.ContentCardContainer>
    </S.Wrapper>
  );
}

export { NormalSignUpPage };
