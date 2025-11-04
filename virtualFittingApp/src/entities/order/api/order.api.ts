import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { ApiResponse } from "@/shared/types/api";

interface OrderStatusResponseData {}

export interface OrderInTransitBody {
  courierCode: string;
  courierName: string;
  trackingNo: string;
}

export const startPreparingOrder = async (
  authUserId: string,
  orderId: string
): Promise<ApiResponse<OrderStatusResponseData> | null> => {
  try {
    const response = await API_BASILIUM.post<ApiResponse<OrderStatusResponseData>>(
      `/b1/orders/brand/my/${orderId}/preparing`,
      null,
      { params: { authUserId } }
    );
    console.log(`[주문 상태 전이] 주문 ID ${orderId}: 배송 준비중 시작 성공.`);
    return response.data;
  } catch (error) {
    console.error(`[주문 상태 전이] 주문 ID ${orderId}: 배송 준비중 시작 실패.`, error);
    return null;
  }
};

export const startInTransitOrder = async (
  authUserId: string,
  orderId: string,
  body: OrderInTransitBody
): Promise<ApiResponse<OrderStatusResponseData> | null> => {
  try {
    const response = await API_BASILIUM.post<ApiResponse<OrderStatusResponseData>>(
      `/b1/orders/brand/my/${orderId}/in-transit`,
      body,
      { params: { authUserId } }
    );
    console.log(`[주문 상태 전이] 주문 ID ${orderId}: 배송 중 시작 성공 (송장 ${body.trackingNo}).`);
    return response.data;
  } catch (error) {
    console.error(`[주문 상태 전이] 주문 ID ${orderId}: 배송 중 시작 실패.`, error);
    return null;
  }
};

export const markOrderAsDelivered = async (
  authUserId: string,
  orderId: string
): Promise<ApiResponse<OrderStatusResponseData> | null> => {
  try {
    const response = await API_BASILIUM.post<ApiResponse<OrderStatusResponseData>>(
      `/b1/orders/brand/my/${orderId}/delivered`,
      null,
      { params: { authUserId } }
    );
    console.log(`[주문 상태 전이] 주문 ID ${orderId}: 배송 완료 성공.`);
    return response.data;
  } catch (error) {
    console.error(`[주문 상태 전이] 주문 ID ${orderId}: 배송 완료 실패.`, error);
    return null;
  }
};

export const confirmOrderPurchase = async (
  authUserId: string,
  orderId: string
): Promise<ApiResponse<OrderStatusResponseData> | null> => {
  try {
    const response = await API_BASILIUM.post<ApiResponse<OrderStatusResponseData>>(
      `/b1/orders/my/${orderId}/confirm`,
      null,
      { params: { authUserId } }
    );
    console.log(`[구매 확정] 주문 ID ${orderId}: 구매 확정 성공 (포인트 적립).`);
    return response.data;
  } catch (error) {
    console.error(`[구매 확정] 주문 ID ${orderId}: 구매 확정 실패.`, error);
    return null;
  }
};
