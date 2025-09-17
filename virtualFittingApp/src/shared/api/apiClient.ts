import { API_BASILIUM } from "@/shared";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export async function apiClient<T>(
  config: AxiosRequestConfig,
  logName: string
): Promise<T | null> {
  try {
    const response: AxiosResponse<{ data: T }> = await API_BASILIUM(config);
    console.log(`[${logName}] API 응답 성공:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`[${logName}] API 요청 실패:`, error);
    return null;
  }
}
