import { InternationalPhoneInput } from "@/pages/auth/components/numberpad";
import * as S from "./style";
import { BrandUserType } from "@/pages/brand";
import { TextInput } from "@/shared";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface IBrandUserInfoWidget {
  data: BrandUserType;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
}

function BrandFirmInfoWidget({
  data,
  onChangeText,
  phone,
  setPhone,
}: IBrandUserInfoWidget) {
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TitleContainer>
          <S.Title>BRAND 회원가입</S.Title>
        </S.TitleContainer>
        <S.InfoBox>
          <TextInput
            name="firmName"
            title="회사 명"
            type="text"
            value={data.firmName}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            name="firmEmail"
            title="회사 Email"
            type="text"
            value={data.firmEmail}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            name="firmAddress"
            title="회사 주소"
            type="text"
            value={data.firmAddress}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <InternationalPhoneInput
            phoneNumber={phone}
            setPhoneNumber={setPhone}
          />
        </S.InfoBox>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { BrandFirmInfoWidget };
