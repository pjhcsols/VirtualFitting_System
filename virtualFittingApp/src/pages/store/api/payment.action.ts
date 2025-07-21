import { API_BASILIUM } from "@/shared";
import { PaymentRequestParams, PaymentResponse } from "@/shared";

export const requestPayment = async (
  params: PaymentRequestParams
): Promise<PaymentResponse | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/request", null, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Payment request failed:", error);
    return null;
  }
};
