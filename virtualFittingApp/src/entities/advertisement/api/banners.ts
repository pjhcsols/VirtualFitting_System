import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { Banner } from "../model/types";

export const fetchBanners = async (adminId: string): Promise<Banner[] | null> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: "/b1/superUsers/me/banners",
    params: { adminId },
  };

  return apiClient<Banner[]>(config);
};