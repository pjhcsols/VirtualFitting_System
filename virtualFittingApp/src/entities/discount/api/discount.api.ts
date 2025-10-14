import { API_BASILIUM } from "@/shared";
import { apiClient } from "@/shared/api/apiClient";
import type { ProductPrice, DiscountQuoteResponse } from "../model/types";

export const fetchDiscountQuote = async (params: { 
  productId: number; 
  userId?: string; 
}): Promise<DiscountQuoteResponse | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/discounts/quote", { params });
    console.log(`[할인 견적 조회: id=${params.productId}] API 응답 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[할인 견적 조회: id=${params.productId}] API 요청 실패:`, error);
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
  }, "상품 공개 가격 일괄 조회");
};

export const fetchProductPrice = (productId: number): Promise<ProductPrice | null> => {
  return apiClient<ProductPrice>({
    method: 'get',
    url: `/b1/discounts/products/price/${productId}`
  }, "상품 공개 가격 조회");
};

