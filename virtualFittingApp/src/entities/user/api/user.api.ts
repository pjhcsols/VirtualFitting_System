import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export const fetchUserData = async () => {
  try {
    const response = await API_BASILIUM.get("/normalUser/userInfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
