import { OrderItem } from "../types/order";
import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export const OrderInfo = async (userId: string): Promise<OrderItem[]> => {
  try {
    const response = await API_BASILIUM.get("/b1/payment/order/history", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("주문 정보를 불러오는 중 오류 발생:", error);
    throw error;
  }
};
