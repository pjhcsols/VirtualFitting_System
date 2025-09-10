import { API_BASILIUM } from "@/shared";
import { 
  PaymentRequestParams, 
  PaymentResponse, 
  // PaymentResultParams, 
  // PaymentData,
  PaymentConfirmParams,
  PaymentIntentRequest, 
  PaymentIntentData,
  ApiResponse,
} from "@/shared";

export const createPaymentReservation = async (
  params: PaymentRequestParams
): Promise<PaymentResponse | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/request", null, {
      params,
    });
    console.log("[단건 결제] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment request failed:", error);
    return null;
  }
};

export const confirmFinalPayment = async (params: PaymentConfirmParams): Promise<any> => {
  try {
    const response = await API_BASILIUM.get("/b1/payment/success", {
      params: params
    });
    console.log("[결제 최종 승인] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    throw error;
  }
};

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

export const reportPaymentResult = async (params: {
  reserveTaskOrderPayId: string;
  success: boolean;
}) => {
  try {
    await API_BASILIUM.post("/b1/payment/response-by-reserve", null, {
      params,
    });
  } catch (error) {
    console.error("Failed to report payment result", error);
  }
};