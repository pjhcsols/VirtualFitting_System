import { Product, ProductDetail } from "@/shared";
import { API_BASILIUM } from "@/shared";

export const fetchOnSaleProducts = async ({
  page = 0,
  size = 20,
  sort = "productId,desc"
} = {}): Promise<Product[]> => {
  try {
    const response = await API_BASILIUM.get("/b1/products/on-sale", {
      params: { page, size, sort }
    });

    return Array.isArray(response.data) ? response.data.map((product: Product) => ({
      ...product,
      discountedPrice: Math.floor(product.productPrice * 0.9)
    })) : [];
  } catch (error) {
    console.error("Failed to fetch ON_SALE products", error);
    return [];
  }
};


export const fetchProductDetailByColor = async (
  productId: number,
  color: string
): Promise<ProductDetail> => {
  const response = await API_BASILIUM.get(`/b1/products/${productId}`, {
    params: { color }
  });

  return response.data;
};

export const fetchProductColors = async (
  productId: number
): Promise<string[]> => {
  try {
    const response = await API_BASILIUM.get(`/b1/products/${productId}/colors`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product colors", error);
    return [];
  }
};

