import { ChangeEvent, MouseEvent, useState } from "react";
import { type LoginRequestDto } from "@/widgets/auth/types/login";
import { userLogin } from "../api/auth.action";
import { useNavigate } from "react-router-dom";

function useLogin() {
  const router = useNavigate();

  const [loginInfo, setLoginInfo] = useState<LoginRequestDto>({
    userId: "",
    userPassword: "",
  });

  const onChangeUserId = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      userId: e.target.value,
    });
  };

  const onChangeUserPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      userPassword: e.target.value,
    });
  };

  const onSubmitLoginInfo = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const res = await userLogin(loginInfo);
    if (res) {
      alert("로그인에 성공하였습니다!");
      router("/store");
    }
  };

  const onClickSignUp = () => {
    router("/signup");
  };

  return {
    loginInfo,
    onChangeUserId,
    onChangeUserPassword,
    onClickSignUp,
    onSubmitLoginInfo,
  };
}

export { useLogin };
