import axios, { AxiosRequestConfig } from "axios";
import { API_BASILIUM } from "../../../shared";

// 사용자 정보 가져오는 함수
export const fetchUserData = async (config: AxiosRequestConfig) => {
  try {
    const response = await API_BASILIUM.get("/normalUser/userInfo")
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
