import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { Cart, PostCartMeRequest, UpdateCartItemRequest } from "../model/types"; 


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

    const response = await apiClient<Cart>(config); 
    
    if (response && (response.status === 200 || response.status === 0) && response.data) {
        return response.data;
    }
    
    return null;
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

  const response = await apiClient<Cart>(config); 

  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }

  return null;
};

export async function deleteCartItems(
  authUserId: string,
  itemIds: number[],
): Promise<Cart | null> { 

  const usp = new URLSearchParams();
  usp.set("authUserId", authUserId);
  for (const id of itemIds) {
      usp.append("itemIds", String(id));
  }
  const queryString = usp.toString();

  const config: AxiosRequestConfig = {
    method: 'delete', 
    url: `/b1/carts/me/items?${queryString}`, 
    data: null, 
  };

  const response = await apiClient<Cart>(config); 

  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }
  
  return null;
}