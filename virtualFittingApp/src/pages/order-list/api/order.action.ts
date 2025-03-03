import { API_BASILIUM } from "@/shared";
import { OrderData } from "../types/order";

interface OrderHistoryResponse {
  data: OrderData[];
}

export const fetchOrderHistory = (): Promise<OrderHistoryResponse> => {
  return API_BASILIUM.get("/normalUser/order/history");
};
