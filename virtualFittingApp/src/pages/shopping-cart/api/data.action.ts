import axios, { AxiosRequestConfig } from "axios";

export const fetchDataItems = async (config: AxiosRequestConfig) => {
  try {
    const response = await axios.get(
      "http://155.230.43.12:8090/normalUser/shopping/list",
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shopping data:", error);
    throw error;
  }
};
