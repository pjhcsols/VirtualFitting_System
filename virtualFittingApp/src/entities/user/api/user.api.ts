import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { UserDetail, UpdateAddressRequest, UserDetailResponse, Gender } from "../model/types";

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

export const fetchMyUserGender = async (): Promise<Gender | null> => {
  try {
    const response = await fetchMyUserDetails(); 
    
    const gender = response?.data?.gender as (Gender | undefined) ?? null; 

    if (!gender) {
      console.warn("[Gender 조회 실패] 사용자 상세 정보에 gender 필드가 없거나 유효하지 않습니다.");
    }

    return gender;
    
  } catch (error) {

    console.error("Error fetching user gender:", error);
    return null;
  }
};

export const fetchMyRegisteredImageUrl = async (userId: string): Promise<string | null> => {
    
  const config: AxiosRequestConfig = {
    method: 'get',
    url: "/b1/users/me/image",
    params: { userId },
  };

  try {
    const response = await apiClient<string>(config);

    if (response && response.status === 0 && response.data) {
        return response.data;
    }

    return null;

  } catch (error) {
    console.error("[현재이미지 조회 실패] 사용자 현재 이미지가 없습니다.", error);
    return null;
  }
};
