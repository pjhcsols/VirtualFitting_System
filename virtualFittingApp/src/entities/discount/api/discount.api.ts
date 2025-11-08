import { API_BASILIUM } from "@/shared";
import { apiClient } from "@/shared/api/apiClient";
import type { ProductPrice, DiscountQuoteResponse } from "../model/types";

export const fetchDiscountQuote = async (params: { 
  productId: number; 
  userId?: string; 
}): Promise<DiscountQuoteResponse | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/discounts/quote", { params });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchProductPricesBatch = (productIds: number[]): Promise<ProductPrice[] | null> => {
  return apiClient<ProductPrice[]>({
    method: 'get',
    url: `/b1/discounts/products/prices`,
    params: {
      ids: productIds.join(','),
    }
  });
};

export const fetchProductPrice = (productId: number): Promise<ProductPrice | null> => {
  return apiClient<ProductPrice>({
    method: 'get',
    url: `/b1/discounts/products/price/${productId}`
  });
};

