import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { UserDetail, UpdateAddressRequest, UserDetailResponse } from "../model/types";

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
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchMyUserLoginType = async (): Promise<UserDetail['loginType'] | null> => {
  try {
    const response = await fetchMyUserDetails(); 
    const loginType = response?.data?.loginType ?? null; 

    if (loginType) {
    } else {
      console.warn("[Login Type 조회 실패] 사용자 상세 정보에 loginType 필드가 없습니다.");
    }
    
    return loginType;
    
  } catch (error) {
    return null;
  }
};

export const updateAddress = async (
  userId: string,
  addressData: UpdateAddressRequest
): Promise<UserDetailResponse | null> => {
  try {
    const response = await API_BASILIUM.patch(`/b1/normalUsers/me`, addressData, {
      params: { userId },
    });
    
    return response.data; 
  } catch (error) {
    console.error("[주소 변경] API 요청 실패:", error);
    throw error;
  }
};