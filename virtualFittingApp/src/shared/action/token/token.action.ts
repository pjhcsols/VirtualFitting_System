import axios from "axios";

export const basilium_refresh_token = async (refreshToken: string) => {
  const BASILIUM_URL = import.meta.env
    .VITE_APPLICATION_BASILIUM_SERVER as string;
  try {
    const res = await axios.post(`${BASILIUM_URL}/`, { refreshToken });
    return res.data;
  } catch (err) {
    return false;
  }
};

export const basilium_ai_refresh_token = async (refreshToken: string) => {
  const BASILIUM_AI_URL = import.meta.env
    .VITE_APPLICATION_BASILIUM_AI_SERVER as string;
  try {
    const res = await axios.post(`${BASILIUM_AI_URL}/`, { refreshToken });
    return res.data;
  } catch (err) {
    return false;
  }
};
