import axios from "axios";
import { Product, ProductDetail } from "@/shared";
import { API_BASE_URL } from "@/shared";

const API_URL = `${API_BASE_URL}/b1/products/on-sale`;

export const fetchOnSaleProducts = async ({
  page = 0,
  size = 20,
  sort = "productId,desc"
} = {}): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, size, sort }
    });

    return response.data.map((product: Product) => ({
      ...product,
      discountedPrice: Math.floor(product.productPrice * 0.9)
    }));
  } catch (error) {
    console.error("Failed to fetch ON_SALE products", error);
    return [];
  }
};

export const fetchProductDetailByColor = async (
  productId: number,
  color: string
): Promise<ProductDetail> => {
  const url = `${API_BASE_URL}/b1/products/${productId}`;
  const response = await axios.get(url, {
    params: { color }
  });

  return response.data;
};

export const fetchProductColors = async (
  productId: number
): Promise<string[]> => {
  try {
    const url = `${API_BASE_URL}/b1/products/${productId}/colors`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product colors", error);
    return [];
  }
};
