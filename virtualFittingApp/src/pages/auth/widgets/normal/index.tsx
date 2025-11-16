import { type NormalUserType } from "@/entities/auth/types/normal.d";
import { InternationalPhoneInput } from "../../components/numberpad";
import * as S from "./style";
import { PasswordInput, TextInput } from "@/shared";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface INormalUserSignUpWidget {
  data: NormalUserType;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
}

function NormalUserSignUpWidget({
  data,
  onChange,
  phone,
  setPhone,
}: INormalUserSignUpWidget) {
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
            onChange={onChange}
          />
        </S.InfoBox>
        <S.InfoBox>
          <PasswordInput
            name="password"
            title="비밀번호"
            value={data.password}
            onChange={onChange}
          />
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            name="name"
            title="이름"
            type="text"
            value={data.name}
            onChange={onChange}
          />
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            name="nickname"
            title="닉네임"
            type="text"
            value={data.nickname}
            onChange={onChange}
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

export { NormalUserSignUpWidget };
