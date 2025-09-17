import { OrderItem } from "../model/types";
import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export const OrderInfo = async (userId: string): Promise<OrderItem[]> => {
  const response = await API_BASILIUM.get("/payment/order/history", {
    params: { userId },
  });
  return response.data;
};
