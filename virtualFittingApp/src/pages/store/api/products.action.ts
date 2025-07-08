import axios from "axios";
import { Product } from "@/shared";
import { API_BASE_URL } from "@/shared";

const API_URL = `${API_BASE_URL}/b1/products/on-sale`;

export const fetchOnSaleProducts = async ({
  page = 0,
  size = 10,
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