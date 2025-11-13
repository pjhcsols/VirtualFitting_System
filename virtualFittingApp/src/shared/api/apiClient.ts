import { API_BASILIUM } from "@/shared";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import type { ApiResponse } from "@/shared/types/api"; 

export async function apiClient<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T> | null> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await API_BASILIUM(config); 

    return response.data; 
  } catch (rawError) {

    const error = rawError as AxiosError<ApiResponse<T>>;
    if (error.response && error.response.data) {
        return error.response.data; 
    }
    
    console.error("API 요청 중 네트워크 오류 또는 알 수 없는 에러 발생:", error);
    return null;
  }
}
