import { API_BASILIUM } from "@/shared";
import type { PaymentRequestParams, PaymentResponse } from "@/entities/payment";

export const createPaymentReservation = async (
  params: PaymentRequestParams,
): Promise<PaymentResponse | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/request", null, {
      params,
    });
    console.log("[결제 예약] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment reservation failed:", error);
    return null;
  }
};
