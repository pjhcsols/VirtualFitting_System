import axios, { AxiosRequestConfig } from "axios";

// 사용자 정보 가져오는 함수
export const fetchUserData = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios.get(
      "http://localhost:8080/normalUser/userInfo",
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
