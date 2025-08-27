import { Product, ProductDetail, ProductPrice, DiscountQuote, ClaimableCoupon } from "@/shared";
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

export const fetchProductPrice = async (
  productId: number
): Promise<ProductPrice | null> => {
  try {
    const response = await API_BASILIUM.get(`/b1/discounts/products/price/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch product price", error);
    return null;
  }
};

export const fetchDiscountQuote = async ({
  productId,
  userId,
}: {
  productId: number;
  userId?: string;
}): Promise<DiscountQuote | null> => {
  try {
    const response = await API_BASILIUM.get("/b1/discounts/quote", {
      params: { productId, userId },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch discount quote", error);
    return null;
  }
};

export const fetchClaimableCoupons = async (
  productId: number,
  normalUserId?: string
): Promise<ClaimableCoupon[]> => {
  try {
    const response = await API_BASILIUM.get(`/b1/coupons/products/${productId}/claimables`, {
      params: normalUserId ? { normalUserId } : {},
    });

    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    console.error("Failed to fetch claimable coupons", error);
    return [];
  }
};