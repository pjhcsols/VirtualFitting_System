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
    return response.data; 
  } catch (error) {
    return null;
  }
};

export const fetchProductColors = async (productId: number): Promise<string[] | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}/colors`);
    return response.data; 
  } catch (error) {
    return null;
  }
};

export const searchProducts = async (productName: string): Promise<Product[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/search", {
      params: { productName }
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchOnSaleProducts = async (
  params: { page: number; size: number; sort: string } = { page: 0, size: 20, sort: "productId,asc" }
): Promise<Product[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/on-sale", {
      params,
    });
    
    return response.data as Product[]; 
  } catch (error) {
    return null;
  }
};

export const fetchAllProductImageUrls = async (): Promise<string[] | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/imageUrls");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchProductsCount = async (): Promise<number | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/count");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<ProductDetail[] | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/category/${categoryId}`);
    return response.data;
  } catch (error) {
    return null;
  }
  // [seah] 추후필터링 기능에
};