import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { Cart, AddCartItemRequest } from "../model/types";

export const fetchMyCart = async (authUserId: string): Promise<Cart | null> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: "/b1/carts/me",
    params: { authUserId },
  };

  return apiClient<Cart>(config, "내 장바구니 조회/생성");
};

export const peekMyCart = async (authUserId: string): Promise<Cart | null> => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: "/b1/carts/me/peek",
    params: { authUserId },
  };

  return apiClient<Cart>(config, "내 장바구니 조회(peek)");
};

export const addCartItem = async (
  authUserId: string,
  itemData: AddCartItemRequest
): Promise<Cart | null> => {
  
  const config: AxiosRequestConfig = {
    method: 'post',
    url: "/b1/carts/me/items",
    params: { authUserId },
    data: itemData,
  };

  return apiClient<Cart>(config, "장바구니 아이템 1건 추가");
};