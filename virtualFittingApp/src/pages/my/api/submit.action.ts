import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import { UserFormData } from "../types/user";

export const submitUserInfo = async (formData: UserFormData) => {
  const response = await API_BASILIUM.post("/api/user/update", formData);
  return response.data;
};
