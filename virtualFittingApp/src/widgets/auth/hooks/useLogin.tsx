import { ChangeEvent, MouseEvent, useState } from "react";
import { type LoginRequestDto } from "@/widgets/auth/types/login";
import { userLogin } from "../api/auth.action";
import { useNavigate } from "react-router-dom";
import { type JwtPayload, jwtDecode } from "jwt-decode";

interface BasiliumJwtPayload extends JwtPayload {
  role: string;
}

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
    if (res === 401) {
      alert("로그인에 실패하였습니다.");
      return;
    }
    if (res === 500) {
      alert("로그인에 실패하였습니다.");
      return;
    }
    alert("로그인에 성공하였습니다!");
    const decodedToken = jwtDecode<BasiliumJwtPayload>(res);
    if (decodedToken.role === "BRAND") {
      router("/brand/dashboard");
    } else {
      router("/store");
    }
  };

  const onClickBrandSignUp = () => {
    router("/signup/brand");
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
    onClickBrandSignUp,
  };
}

export { useLogin };
