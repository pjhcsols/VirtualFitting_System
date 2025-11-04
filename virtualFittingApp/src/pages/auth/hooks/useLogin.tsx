import { ChangeEvent, useState } from "react";
import type { TLoginUser } from "@/pages/auth/types/auth";
import { login } from "@/pages/auth/api/login.action";
import { globalEventBus } from "@/shared/event";
import { LOGIN_ERROR_STATUS } from "@/pages/auth/constants";
import { isLoginKey } from "@/pages/auth/utils/type";
import { useSetRecoilState } from 'recoil';
import { authState } from "@/entities/auth";
import Swal from "sweetalert2";

function useLogin() {
  const [user, setUser] = useState<TLoginUser>({
    userId: "",
    userPassword: "",
  });

  const [errMsg, setErrMsg] = useState<TLoginUser>({
    userId: "",
    userPassword: "",
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isLoginKey(name)) {
      return;
    }
    setUser({
      ...user,
      [name]: value,
    });
  };

  const setAuth = useSetRecoilState(authState);

  // 나중에 EventBus 오류 발생 지점 컴포넌트로 따로 빼도 될듯
  const onSubmit = async () => {
    try {
      setAuth(true);
      await login(user);
      Swal.fire({
        title: "Success!",
        text: "로그인에 성공했습니다.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/";
      });
    } catch (err: any) {
      let message: string;
      if (err.response && err.response.status === 401) {
        message =
          LOGIN_ERROR_STATUS.get("WRONG_PASSWORD")?.message ??
          "알 수 없는 오류 발생";
        globalEventBus.emit(
          "api-error",
          LOGIN_ERROR_STATUS.get("WRONG_PASSWORD")
        );
        setErrMsg({
          ...errMsg,
          userPassword: message,
        });
      } else if (err.response && err.response.status === 404) {
        message =
          LOGIN_ERROR_STATUS.get("NO_USER")?.message ?? "알 수 없는 오류 발생";
        globalEventBus.emit("api-error", LOGIN_ERROR_STATUS.get("NO_USER"));
        setErrMsg({
          ...errMsg,
          userId: message, // 404는 userId에 대한 에러
        });
      }
    }
  };

  return {
    user,
    errMsg,
    onChange,
    onSubmit,
  };
}

export { useLogin };
