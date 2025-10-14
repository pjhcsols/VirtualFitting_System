import { BrandUserBasicInfoWidget } from "../../widgets/brand/basic";
import * as S from "./style";

import { useBrand } from "@/pages/auth/hooks/useBrand";

function BrandSignUp() {
  const { user, next, prev, step, onChangeText, onSubmit } = useBrand();
  return (
    <S.Wrapper>
      <S.StepInformation>
        <S.StepText step={step} onClick={prev}>
          회원정보 기입
        </S.StepText>
        <S.StepText step={(step + 1) % 2} onClick={next}>
          회사정보 기입
        </S.StepText>
      </S.StepInformation>
      {step === 0 && (
        <BrandUserBasicInfoWidget data={user} onChangeText={onChangeText} />
      )}
      {step === 1 && <></>}
      <S.ButtonContainer>
        <S.NextButton onClick={step === 1 ? onSubmit : next}>
          {step === 1 ? "신청" : "다음"}
        </S.NextButton>
        <S.CancelButton to={"/"}>취소</S.CancelButton>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { BrandSignUp };
