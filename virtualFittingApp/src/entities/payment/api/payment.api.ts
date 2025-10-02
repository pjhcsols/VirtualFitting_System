import { ApiResponse } from "@/shared/types/api";
import { API_BASILIUM } from "@/shared";
import type { PaymentReservationStatus } from "../model/types";

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

