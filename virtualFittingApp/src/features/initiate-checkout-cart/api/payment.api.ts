import { API_BASILIUM } from "@/shared";
import type { PaymentResponse, BatchPaymentRequestBody } from "@/entities/payment";

export const createBatchPaymentReservation = async (
  userId: string,
  requestBody: BatchPaymentRequestBody,
): Promise<PaymentResponse | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/request-batch", requestBody, {
      params: { userId },
    });
    console.log("[장바구니 결제 예약] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Batch payment reservation failed:", error);
    return null;
  }
};

