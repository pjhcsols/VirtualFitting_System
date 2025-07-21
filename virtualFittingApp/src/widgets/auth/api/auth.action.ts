import { API_BASILIUM } from "@/shared";
import type { LoginRequestDto } from "@/widgets/auth/types/login";
import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";

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

export const userLogin = async (userInfo: LoginRequestDto) => {
  try {
    const BASILIUM_URL = import.meta.env
      .VITE_APPLICATION_BASILIUM_SERVER as string;
    const res = await axios.post(`${BASILIUM_URL}/b1/users/login`, userInfo);
    if (res.status === 200) {
      console.log(res.data);
      Cookies.set("access-token", res.data.data.accessToken);
      Cookies.set("refresh-token", res.data.data.refreshToken);
      return true;
    }
  } catch (err) {
    if (isAxiosError(err)) {
      switch (err.status) {
        case 401:
          return 401;
        default:
          return 500;
      }
    }
  }
};
