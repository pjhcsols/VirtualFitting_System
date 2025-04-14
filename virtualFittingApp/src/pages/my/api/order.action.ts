import { OrderItem } from "../types/order";
import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export const OrderInfo = async (): Promise<OrderItem[]> => {
  const response = await API_BASILIUM.get("/api/order/list");
  return response.data;
};
