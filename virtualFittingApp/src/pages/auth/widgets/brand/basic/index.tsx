import * as S from "./style";

import { type BrandUserType } from "@/pages/brand";
import { useState, type ChangeEvent } from "react";

import { TextInput } from "@/shared";
import { EyeIcon } from "lucide-react";

interface IBrandUserBasicInfoWidget {
  data: BrandUserType;
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
}

function BrandUserBasicInfoWidget({
  data,
  onChangeText,
}: IBrandUserBasicInfoWidget) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TitleContainer>
          <S.Title>BASILIUM BRAND 기본정보</S.Title>
        </S.TitleContainer>
        <S.InfoBox>
          <S.SubTitle>ID</S.SubTitle>
          <TextInput
            name="id"
            title="ID"
            type="text"
            value={data.id}
            onChange={onChangeText}
          />
        </S.InfoBox>
        <S.InfoBox>
          <S.SubTitle>PASSWORD</S.SubTitle>
          <TextInput
            name="password"
            onChange={onChangeText}
            title="비밀번호"
            type={showPassword ? "text" : "password"}
            value={data.password}
          />
          <S.ToggleButton
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <EyeIcon
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showPassword ? (
                // 눈 감은 아이콘
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.93-6.93a2.99 2.99 0 0 0-4.17-.11L9.9 4.24z" />
                </>
              ) : (
                // 눈 뜬 아이콘
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </EyeIcon>
          </S.ToggleButton>
        </S.InfoBox>
        <S.InfoBox>
          <S.SubTitle>EMAIL</S.SubTitle>
          <TextInput
            value={data.emailAddress}
            onChange={onChangeText}
            name={"emailAddress"}
            title="이메일"
            type="email"
          />
        </S.InfoBox>
        <S.InfoBox>
          <S.SubTitle>PHONE-NUMBER</S.SubTitle>
        </S.InfoBox>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { BrandUserBasicInfoWidget };
