import * as S from "./style";

import { type BrandUserType } from "@/pages/brand";
import { Dispatch, SetStateAction, type ChangeEvent } from "react";

import { PasswordInput, TextInput } from "@/shared";
import { InternationalPhoneInput } from "@/pages/auth/components/numberpad";

interface IBrandUserBasicInfoWidget {
  data: BrandUserType;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
}

function BrandUserBasicInfoWidget({
  data,
  phone,
  setPhone,
  onChangeText,
}: IBrandUserBasicInfoWidget) {
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TitleContainer>
          <S.Title>BRAND 회원가입</S.Title>
        </S.TitleContainer>
        <S.InfoBox>
          <TextInput
            name="id"
            title="ID"
            type="text"
            value={data.id}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <PasswordInput
            name="password"
            title="password"
            value={data.password}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            value={data.emailAddress}
            onChange={onChangeText}
            name={"emailAddress"}
            title="이메일"
            type="text"
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

export { BrandUserBasicInfoWidget };
