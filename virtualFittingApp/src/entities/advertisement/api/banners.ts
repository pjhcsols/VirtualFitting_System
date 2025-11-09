import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { Banner } from "../model/types";

export const fetchBanners = async (adminId: string): Promise<Banner[] | null> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: "/b1/superUsers/me/banners",
    params: { adminId },
  };

  try {
    const response = await apiClient<Banner[]>(config);
    if (response && response.data) {
      return response.data; 
    }
    return null;

  } catch (error) {
    console.error("Error fetching banners:", error);
    return null;
  }
};