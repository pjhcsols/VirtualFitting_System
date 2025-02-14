import axios from "axios";
import { PaymentData } from "../types/paymentData";

const API_URL = "http://155.230.43.12:8090/normalUser";

// 유저 정보 요청
export const fetchUserInfo = async (jwtToken: string) => {
    const config = {
        headers: {
        Authorization: `Bearer ${jwtToken}`,
        },
    };
    try {
        const response = await axios.get(`${API_URL}/user/detail`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};

// 결제 후 상품 정보 전송
export const postPayment = async (impUid: string, paymentData: PaymentData, jwtToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  try {
    const response = await axios.post(`${API_URL}/order/payment/${impUid}`, paymentData, config);
    return response.data;
  } catch (error) {
    console.error("Error completing payment:", error);
    throw error;
  }
};

// 쇼핑 목록에서 항목 삭제
export const deleteProductFromCart = async (shoppingCartId: string, jwtToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  try {
    await axios.delete(`${API_URL}/shopping/list?shoppingListId=${shoppingCartId}`, config);
  } catch (error) {
    console.error("Error deleting item from shopping cart:", error);
    throw error;
  }
};
