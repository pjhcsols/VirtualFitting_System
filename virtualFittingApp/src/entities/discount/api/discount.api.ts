import { API_BASILIUM } from "@/shared";
import { apiClient } from "@/shared/api/apiClient";
import type { ProductPrice, DiscountQuoteData } from "../model/types";

export const fetchDiscountQuote = async (params: { 
  productId: number; 
  userId?: string; 
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
  
  // ✅ response는 ApiResponse<ProductPrice> | null 타입입니다.
  if (response && (response.status === 200 || response.status === 0) && response.data) {
    
    // ⭐️ 수정: 디버깅 로그를 return 전에 위치시킵니다. ⭐️
    console.log(`[Price API Success - ID:${productId}] Data fetched:`, response.data); 
    
    // ⭐️ 순수 데이터 페이로드 (ProductPrice)를 반환합니다. ⭐️
    return response.data;
  }
  
  // 🚨 디버깅 로그 추가: API 호출은 됐으나 실패했을 때의 응답 (404 등)
  console.error(`[Price API Failed - ID:${productId}] Full response:`, response);
  return null;
};
