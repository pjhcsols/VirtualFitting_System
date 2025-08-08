import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import Cookies from "js-cookie";

export const fetchUserInfo = async () => {
  try {
    const refreshToken = Cookies.get("refresh-token");

    if (!refreshToken) {
      throw new Error("쿠키에서 refresh-token을 찾을 수 없습니다.");
    }

    let userId: string | undefined;

    const tokenResponse = await API_BASILIUM.post("/b1/users/refresh-token", null, {
        params: { refreshToken },
    });

    if (tokenResponse.status === 200) {
      userId = tokenResponse.data.data.userId;
      Cookies.set("userId", userId as string);
    }

    const res = await API_BASILIUM.get("b1/normalUsers/me", {
      params: { userId },
    });

    if (res.status === 200) {
      return res.data;
    }

  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};