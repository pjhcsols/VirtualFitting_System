import { API_BASILIUM } from "@/shared";
import { apiClient } from "@/shared/api/apiClient";
import type { ProductPrice, DiscountQuoteData } from "../model/types";

export const fetchDiscountQuote = async (params: { 
  productId: number; 
  userId?: string; 
  color?: string;
  size?: string;
}): Promise<DiscountQuoteData | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/discounts/quote", { params });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchProductPricesBatch = async (productIds: number[]): Promise<ProductPrice[] | null> => {
  const response = await apiClient<ProductPrice[]>({
    method: 'get',
    url: `/b1/discounts/products/prices`,
    params: {
      ids: productIds.join(','),
    }
  });
  if (response && response.status === 0 && response.data) {
    return response.data; 
  }
  
  return null;
};

export const fetchProductPrice = async (productId: number): Promise<ProductPrice | null> => {
  const response = await apiClient<ProductPrice>({
    method: 'get',
    url: `/b1/discounts/products/price/${productId}`
  });
  
  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }
  
  return null;
};
