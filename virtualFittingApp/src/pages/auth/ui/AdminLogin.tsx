import { BasiliumSVGLogo, LoginButton } from "@/shared";
import { ChangeEvent, MouseEvent, useState } from "react";
import { AdminUserType } from "@/pages/admin/types/AdminUser";
import { emailVerify } from "../../admin/utils/text.utils";
import styled from "styled-components";
import { TextInput } from "@/shared/components/common";

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
    <Wrapper>
      <LogoContainer>
        <BasiliumSVGLogo />
      </LogoContainer>
      <InputContainer>
        <TextInput
          type="email"
          name="email"
          title="Email"
          onChange={onChangeInfo}
          value={userInfo.email}
        />
        <TextInput
          type="password"
          name="password"
          title="Password"
          onChange={onChangeInfo}
          value={userInfo.password}
        />
        <LoginButton onSubmit={onSubmitUserInfo} />
      </InputContainer>
    </Wrapper>
  );
}

export { AdminLogin };

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  background-color: #fffafa;
`;

const LogoContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 40%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  align-items: center;
`;

const InputContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;
