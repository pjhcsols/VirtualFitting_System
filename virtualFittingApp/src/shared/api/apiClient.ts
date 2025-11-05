import { API_BASILIUM } from "@/shared";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export async function apiClient<T>(
  config: AxiosRequestConfig,
): Promise<T | null> {
  try {
    const response: AxiosResponse<{ data: T }> = await API_BASILIUM(config);
    return response.data.data;
  } catch (error) {
    return null;
  }
}
