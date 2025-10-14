import { ChangeEvent, useState } from "react";
import type { TLoginUser } from "@/pages/auth/types/auth";
import { login } from "@/pages/auth/api/login.action";
import { globalEventBus } from "@/shared/event";
import { LOGIN_ERROR_STATUS } from "@/pages/auth/constants";
import { isLoginKey } from "@/pages/auth/utils/type";

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

  // 나중에 EventBus 오류 발생 지점 컴포넌트로 따로 빼도 될듯
  const onSubmit = async () => {
    try {
      await login(user);
    } catch (err) {
      let message: string;
      if (err instanceof CustomException) {
        message =
          LOGIN_ERROR_STATUS.get("WRONG_PASSWORD")?.message ??
          "알 수 없는 오류 발생";
        if (err.status === 401) {
          globalEventBus.emit(
            "api-error",
            LOGIN_ERROR_STATUS.get("WRONG_PASSWORD"),
          );
          setErrMsg({
            ...errMsg,
            userPassword: message,
          });
        }
        if (err.status === 404) {
          message =
            LOGIN_ERROR_STATUS.get("NO_USER")?.message ??
            "알 수 없는 오류 발생";
          globalEventBus.emit("api-error", LOGIN_ERROR_STATUS.get("NO_USER"));
          setErrMsg({
            ...errMsg,
            userPassword: message,
          });
        }
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
