import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { UserDetailResponse } from "../model/types";

export const fetchUserData = async () => {
  try {
    const response = await API_BASILIUM.get("/normalUser/userInfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchMyUserDetails = async (): Promise<UserDetailResponse | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/normalUsers/me/detail");
    console.log("[내 정보 상세 조회] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[내 정보 상세 조회] API 요청 실패:", error);
    return null;
  }
};
