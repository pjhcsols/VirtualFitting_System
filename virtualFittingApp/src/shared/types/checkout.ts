import type {
  ProductColorPayment,
  ProductSizePayment,
} from "@/entities/payment";

export interface CheckoutItemDetail {
  id: number;
  productId: number;
  name: string;
  brand: string;
  image: string;

  price: number;
  discountedPrice?: number;

  color: ProductColorPayment;
  size: ProductSizePayment;
  quantity: number;
}
