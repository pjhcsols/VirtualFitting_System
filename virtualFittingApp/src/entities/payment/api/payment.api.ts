import { ApiResponse } from "@/shared/types/api";
import { API_BASILIUM } from "@/shared";
import type { 
  PaymentReservationStatus,
  PaymentRequestParams, 
  PaymentResponse,
  PaymentConfirmParams, 
  PaymentFailParams, 
  PaymentIntentRequest, 
  PaymentIntentData, 
  ReportPaymentResultParams,
  BatchPaymentRequestBody, 
} from "../model/types";

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

export const fetchReservationStatus = async (
  rid: string
): Promise<ApiResponse<PaymentReservationStatus> | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/payment/reservations/${rid}`);
    console.log(`[예약 상태 조회: ${rid}] API 응답 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[예약 상태 조회: ${rid}] API 요청 실패:`, error);
    return null;
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

export const reportPaymentResult = async (params: ReportPaymentResultParams): Promise<any> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/response-by-reserve", null, {
      params,
    });
    console.log(`[재고 예약 정리: ${params.success ? '성공' : '실패'}] API 응답 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[재고 예약 정리] API 요청 실패:`, error);
  }
};

export const getPaymentInfo = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const res = await API_BASILIUM.get(
    `/b1/payment/my?page=${page}&size=${size}`,
  );
  if (res.status === 200) {
    console.log("결제 내역을 가져오는데 성공했습니다.");
    return res.data;
  }
  throw new Error(`Failed to fetch payment: ${res.status}`); 
};