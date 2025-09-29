import { API_BASILIUM } from "@/shared";
import type { PaymentResponse, BatchPaymentRequestBody } from "@/entities/payment";

/**
 * 장바구니의 여러 상품에 대한 재고를 한 번에 예약하고 예약 ID를 발급받습니다.
 * @param userId - 인증된 사용자의 ID
 * @param requestBody - 예약할 상품 목록(items)을 포함하는 객체
 * @returns 결제 예약 정보(PaymentResponse) 또는 실패 시 null
 */
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

