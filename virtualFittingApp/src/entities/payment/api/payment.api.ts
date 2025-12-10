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
  console.log("/payment/request", params);
  try {
    const response = await API_BASILIUM.post("/b1/payment/request", null, {
      params,
    });
    console.log("/payment/request response:", response.data);
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
  console.log("/payment/request-batch", userId, "and requestBody:", requestBody);
  try {
    const response = await API_BASILIUM.post("/b1/payment/request-batch", requestBody, {
      params: { userId },
    });
    console.log("/payment/request-batch response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Batch payment reservation failed:", error);
    return null;
  }
};

export const fetchReservationStatus = async (
  rid: string
): Promise<ApiResponse<PaymentReservationStatus> | null> => {
  console.log("/payment/reservations/", rid);
  try {
    const response = await API_BASILIUM.get(`/b1/payment/reservations/${rid}`);
    console.log("[예약 상태 조회: /payment/reservations response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`[예약 상태 조회: ${rid}] API 요청 실패:`, error);
    return null;
  }
};

export const createPaymentIntent = async (
  paymentIntent: PaymentIntentRequest
): Promise<ApiResponse<PaymentIntentData> | null> => {
  console.log("/payment/intents", paymentIntent);
  try {
    const response = await API_BASILIUM.post("/b1/payment/intents", paymentIntent);
    console.log("/payment/intents response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    alert("결제 정보를 확정하는 데 실패했습니다.");
    return null;
  }
};

export const confirmFinalPayment = async (params: PaymentConfirmParams): Promise<any> => {
  console.log("/payment/success", params);
  try {
    const response = await API_BASILIUM.get("/b1/payment/success", {
      params: params,
    });
    console.log("/payment/success response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    throw error;
  }
};

export const reportPaymentFailure = async (params: PaymentFailParams): Promise<any> => {
  console.log("/payment/fail", params);
  try {
    const response = await API_BASILIUM.get("/b1/payment/fail", {
      params: params,
    });
    console.log("/payment/fail response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Payment failure reporting failed:", error);
    throw error;
  }
};

export const reportPaymentResult = async (params: ReportPaymentResultParams): Promise<any> => {
  console.log("/payment/response-by-reserve", params);
  try {
    const response = await API_BASILIUM.post("/b1/payment/response-by-reserve", null, {
      params,
    });
    console.log("/payment/response-by-reserve response:", response.data);
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
    console.log("결제 내역 response:", res.data);
    return res.data;
  }
  throw new Error(`Failed to fetch payment: ${res.status}`); 
};