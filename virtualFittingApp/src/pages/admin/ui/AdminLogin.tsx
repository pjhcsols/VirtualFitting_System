import * as S from "@/pages/admin/ui/css/AdminLogin.css";
import { BasiliumSVGLogo, LoginInput, LoginButton } from "@/shared";
import { ChangeEvent, MouseEvent, useState } from "react";
import { AdminUserType } from "@/pages/admin/types/AdminUser";
import { emailVerify } from "../utils/text.utils";

function AdminLogin() {
  const [userInfo, setUserInfo] = useState<AdminUserType>({
    email: "",
    password: "",
  });

  const onChangeInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      setUserInfo({
        ...userInfo,
        [name]: value,
      });
    }
  };

  const onSubmitUserInfo = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (emailVerify(userInfo.email)) {
      alert("이메일 형식을 지켜주세요!");
    }
    if (userInfo.password.length > 16) {
      alert("비밀번호는 16자 이내로 부탁드릴게요!");
    }
  };

  return (
    <S.Wrapper>
      <S.LogoContainer>
        <BasiliumSVGLogo />
      </S.LogoContainer>
      <S.InputContainer>
        <LoginInput
          value={userInfo.email}
          name="email"
          type={true}
          onChange={onChangeInfo}
          placeholder="Email"
        />
        <LoginInput
          value={userInfo.password}
          name="password"
          type={false}
          onChange={onChangeInfo}
          placeholder="Password"
        />
        <LoginButton onSubmit={onSubmitUserInfo} />
      </S.InputContainer>
    </S.Wrapper>
  );
}

export { AdminLogin };
