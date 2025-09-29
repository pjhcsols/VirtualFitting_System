import { API_BASILIUM } from "@/shared";
import type { PaymentConfirmParams, PaymentFailParams, PaymentIntentRequest, PaymentIntentData } from "@/entities/payment";
import { ApiResponse } from "@/shared/types/api";

export const createPaymentIntent = async (
  paymentIntent: PaymentIntentRequest
): Promise<ApiResponse<PaymentIntentData> | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/intents", paymentIntent);
    console.log("[결제 의도 생성] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    alert("결제 정보를 확정하는 데 실패했습니다.");
    return null;
  }
};

export const confirmFinalPayment = async (params: PaymentConfirmParams): Promise<any> => {
  try {
    const response = await API_BASILIUM.get("/b1/payment/success", {
      params: params,
    });
    console.log("[결제 최종 승인] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    throw error;
  }
};

export const reportPaymentFailure = async (params: PaymentFailParams): Promise<any> => {
  try {
    const response = await API_BASILIUM.get("/b1/payment/fail", {
      params: params,
    });
    console.log("[결제 실패 기록] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment failure reporting failed:", error);
    throw error;
  }
};