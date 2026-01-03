import { apiClient } from "@/shared/api/apiClient";
import type { AxiosRequestConfig } from "axios";
import type { Cart, PostCartMeRequest, UpdateCartItemRequest } from "../model/types"; 


export const upsertCart = async (
    accessToken: string,
    requestData?: PostCartMeRequest | null
): Promise<Cart | null> => {

    const config: AxiosRequestConfig = {
        method: 'post',
        url: "/b1/carts/me",
        headers: {
            Authorization: `Bearer ${accessToken}`,
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
  accessToken: string,
  itemId: number,
  updateData: UpdateCartItemRequest
): Promise<Cart | null> => {

  const config: AxiosRequestConfig = {
    method: 'patch',
    url: `/b1/carts/me/items/${itemId}`,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
    data: updateData,
  };

  const response = await apiClient<Cart>(config); 

  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }

  return null;
};

export async function deleteCartItems(
  accessToken: string,
  itemIds: number[],
): Promise<Cart | null> { 

  const usp = new URLSearchParams();
  for (const id of itemIds) {
      usp.append("itemIds", String(id));
  }
  const queryString = usp.toString();

  const config: AxiosRequestConfig = {
    method: 'delete', 
    url: `/b1/carts/me/items?${queryString}`, 
    data: null, 
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  };

  const response = await apiClient<Cart>(config); 

  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }
  
  return null;
}