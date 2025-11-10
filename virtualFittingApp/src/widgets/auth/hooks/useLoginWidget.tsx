import { ChangeEvent, MouseEvent, useState } from "react";
import { type LoginRequestDto } from "@/widgets/auth/types/login";
import { userLogin } from "../api/auth.action";
import { useNavigate } from "react-router-dom";
import { type JwtPayload, jwtDecode } from "jwt-decode";
import { useSetRecoilState } from 'recoil';
import { authState } from '@/entities/auth'; 

interface BasiliumJwtPayload extends JwtPayload {
  role: string;
}

function useLoginWidget() {
  const router = useNavigate();

  const [loginInfo, setLoginInfo] = useState<LoginRequestDto>({
    userId: "",
    userPassword: "",
  });

  const setAuthState = useSetRecoilState(authState);

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

  const onSubmitLoginInfo = async (e: MouseEvent<HTMLButtonElement>) => {
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

    const decodedToken = jwtDecode<BasiliumJwtPayload>(res);
    setAuthState({ isLoggedIn: true, userId: decodedToken.sub ?? null });
    
    alert("로그인에 성공하였습니다!");
    if (decodedToken.role === "BRAND") {
      router("/brand/dashboard");
    } else if (decodedToken.role === "SUPER") {
      router("/admin");
    } else {
      router("/");
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

export { useLoginWidget };
