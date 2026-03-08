import { ApiResponse } from "@/shared/types/api";
import { API_BASILIUM } from "@/shared";

export interface FooterInfo {
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
}

export const getFooterInfo = async (): Promise<ApiResponse<FooterInfo> | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/brandUsers/1/business-info");

    return response.data;
  } catch (error) {
    console.error("getFooterInfo failed:", error);
    return null;
  }
};