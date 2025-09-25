import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

// 사용자 정보 가져오는 함수
export const fetchUserData = async () => {
  try {
    const response = await API_BASILIUM.get("/normalUser/userInfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
