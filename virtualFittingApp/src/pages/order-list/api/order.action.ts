import { API_BASILIUM } from "@/shared/config/AxiosConfig";


export const fetchOrderHistory = () => {
    return API_BASILIUM.get("/normalUser/order/history");
  };