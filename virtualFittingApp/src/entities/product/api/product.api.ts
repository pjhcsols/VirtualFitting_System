import { API_BASILIUM } from "@/shared";
import { apiClient } from "@/shared/api/apiClient";
import type { 
  Product, 
  ProductDetail, 
  ProductPrice, 
  DiscountQuote,
} from "../model/types";

export const fetchOnSaleProducts = async (
  params = { page: 0, size: 20, sort: "productId,desc" }
): Promise<Product[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/on-sale", {
      params,
    });
    console.log("[판매 중인 상품 조회] API 응답 성공:", response.data);
    return response.data; 
  } catch (error) {
    console.error("[판매 중인 상품 조회] API 요청 실패:", error);
    return null;
  }
};

export const fetchProductDetailByColor = async (
  productId: number,
  color: string
): Promise<ProductDetail | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}`, {
      params: { color }
    });
    console.log("[상품 상세 조회] API 응답 성공:", response.data);
    return response.data; 
  } catch (error) {
    console.error("[상품 상세 조회] API 요청 실패:", error);
    return null;
  }
};

export const fetchProductColors = async (productId: number): Promise<string[] | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}/colors`);
    console.log("[상품 색상 목록 조회] API 응답 성공:", response.data);
    return response.data; 
  } catch (error) {
    console.error("[상품 색상 목록 조회] API 요청 실패:", error);
    return null;
  }
};

export const fetchProductPrice = (productId: number): Promise<ProductPrice | null> => {
  return apiClient<ProductPrice>({
    method: 'get',
    url: `/b1/discounts/products/price/${productId}`
  }, "상품 가격 조회");
};

export const fetchDiscountQuote = (params: { productId: number; userId?: string; }): Promise<DiscountQuote | null> => {
  try {
    return API_BASILIUM.get("/b1/discounts/quote", { params }).then(res => res.data);
  } catch (error) {
    console.error("[할인 견적 조회] API 요청 실패:", error);
    return Promise.resolve(null);
  }
};
