import { ApiResponse } from "@/shared/types/api";
import { API_BASILIUM } from "@/shared";
import type { PaymentReservationStatus } from "../model/types";

/**
 * 예약 식별자(RID)를 기준으로 재고 예약의 현재 상태를 조회합니다. (폴링용)
 * @param rid - 조회할 예약의 식별자(ID)
 * @returns 예약 상태 정보(ApiResponse) 또는 실패 시 null
 */
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

