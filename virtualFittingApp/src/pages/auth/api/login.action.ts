"use server";

import { API_BASILIUM, NOT_LOGGED_BASILIUM_API } from "@/shared";
import type { TLoginUser } from "../types/auth";
import Cookies from "js-cookie";

export const login = async (request: TLoginUser) => {
  const BASILIUM_URL = import.meta.env
    .VITE_APPLICATION_BASILIUM_SERVER as string;
  const res = await NOT_LOGGED_BASILIUM_API.post(
    `${BASILIUM_URL}/b1/users/login`,
    request,
  );
  if (res.status === 200) {
    Cookies.set("access-token", res.data.data.accessToken);
    Cookies.set("refresh-token", res.data.data.refreshToken);
    return res.data.data.accessToken;
  }
  if (res.status === 401) {
    throw new CustomException(401, "비밀번호가 틀렸습니다.");
  }
  if (res.status === 404) {
    return new CustomException(404, "아이디를 찾을 수 없습니다.");
  }
  throw new CustomException(500, "서버가 동작하지 않습니다.");
};

export const Logout = async () => {
  try {
    const res = await API_BASILIUM.post("/b1/users/logout");
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    return false;
  }
};
