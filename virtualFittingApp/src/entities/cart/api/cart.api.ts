import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import { Cart, PostCartMeRequest, UpdateCartItemRequest } from "../model/types";

export const upsertCart = async (
    authUserId: string,
    requestData?: PostCartMeRequest | null
): Promise<Cart | null> => {

    const config: AxiosRequestConfig = {
        method: 'post',
        url: "/b1/carts/me",
        headers: {
            Authorization: `Bearer ${authUserId}`,
        },
        data: requestData || {},
    };

    const action = requestData ? "장바구니 아이템 추가" : "장바구니 조회/생성";
    return apiClient<Cart>(config, action);
};

export const updateCartItem = async (
  authUserId: string,
  itemId: number,
  updateData: UpdateCartItemRequest
): Promise<Cart | null> => {

  const config: AxiosRequestConfig = {
    method: 'patch',
    url: `/b1/carts/me/items/${itemId}`,
    params: { authUserId },
    data: updateData,
  };

  return apiClient<Cart>(config, `장바구니 아이템 ID ${itemId} 수정`);
};
