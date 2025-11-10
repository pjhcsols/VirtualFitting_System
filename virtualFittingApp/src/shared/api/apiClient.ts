import { API_BASILIUM } from "@/shared";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponse } from "@/shared/types/api"; 

export async function apiClient<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T> | null> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await API_BASILIUM(config); 
    
    return response.data; 
  } catch (error) {
    return null;
  }
}
