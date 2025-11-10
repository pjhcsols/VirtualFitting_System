import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { ApiResponse } from "@/shared/types/api";

export const OrderInfo = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const res = await API_BASILIUM.get(
    `/b1/orders/my?page=${page}&size=${size}`,
  );
  if (res.status === 200) {
    console.log("주문 내역을 가져오는데 성공했습니다.");
    return res.data;
  }
  // CustomException이 정의되지 않았을 수 있으므로 주석 처리하거나 정의 필요
  // throw new CustomException(res.status, "주문 내역을 가져오는데 실패했습니다."); 
  throw new Error(`Failed to fetch orders: ${res.status}`); // 임시 예외 처리
};

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
    return response.data;
  } catch (error) {
    console.error(`[구매 확정] 주문 ID ${orderId}: 구매 확정 실패.`, error);
    return null;
  }
};

export const getOrderinfoDetail = async (
  authUserId: string,
  orderId: string
): Promise<ApiResponse<OrderStatusResponseData> | null> => {
  try {
    const response = await API_BASILIUM.post<ApiResponse<OrderStatusResponseData>>(
      `/b1/orders/my/${orderId}`,
      null,
      { params: { authUserId } }
    );
    return response.data;
  } catch (error) {
    console.error(`주문상세정보 불러오기 실패.`, error);
    return null;
  }
};
