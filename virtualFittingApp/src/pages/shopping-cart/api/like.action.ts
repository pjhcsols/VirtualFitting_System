import axios, { AxiosRequestConfig } from "axios";

export const fetchLikedItems = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios.get(
      "http://155.230.43.12:8090/normalUser/like/list",
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching liked items:", error);
    throw error;
  }
};
