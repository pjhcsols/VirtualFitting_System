import { API_BASILIUM } from "@/shared";
import type { 
  Product, 
  ProductDetail, 
} from "../model/types";

export const fetchProductDetailByColor = async (
  productId: number,
  color: string
): Promise<ProductDetail | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}`, {
      params: { color }
    });
    console.log(`[상품 상세 조회: id=${productId}, color=${color}] API 응답 성공:`, response.data);
    return response.data; 
  } catch (error) {
    console.error(`[상품 상세 조회: id=${productId}, color=${color}] API 요청 실패:`, error);
    return null;
  }
};

export const fetchProductColors = async (productId: number): Promise<string[] | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}/colors`);
    console.log(`[상품 색상 목록 조회: id=${productId}] API 응답 성공:`, response.data);
    return response.data; 
  } catch (error) {
    console.error(`[상품 색상 목록 조회: id=${productId}] API 요청 실패:`, error);
    return null;
  }
};

export const searchProducts = async (productName: string): Promise<Product[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/search", {
      params: { productName }
    });
    console.log(`[상품 검색: "${productName}"] API 응답 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[상품 검색: "${productName}"] API 요청 실패:`, error);
    return null;
  }
};

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

export const fetchAllProductImageUrls = async (): Promise<string[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/imageUrls");
    console.log("[전체 상품 이미지 URL 조회] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[전체 상품 이미지 URL 조회] API 요청 실패:", error);
    return null;
  }
};

export const fetchProductsCount = async (): Promise<number | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/count");
    console.log("[상품 개수 조회] API 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[상품 개수 조회] API 요청 실패:", error);
    return null;
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<ProductDetail[] | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/category/${categoryId}`);
    console.log(`[카테고리별 상품 조회: id=${categoryId}] API 응답 성공:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[카테고리별 상품 조회: id=${categoryId}] API 요청 실패:`, error);
    return null;
  }
};