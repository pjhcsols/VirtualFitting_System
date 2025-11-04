import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  discountedPrice?: number;
  discountRate?: number;
  color: ProductColorPayment; 
  size: ProductSizePayment; 
  quantity: number;
};

export interface CartItemResponse {
  itemId: number;
  productId: number;
  size: string;
  color: string;
  quantity: number;
  brandUserNumber: number;
  brandFirmName: string;
  
  productName: string;         
  productPrice: number;        
  discountedPrice: number;     
  discountPercent: number | null; 
  productPhotoUrls: string[];  
  
  couponDiscountPrice: number;
  couponPercent: number | null;
  discountedTotal: number;
  finalLinePayable: number;
  optionQuantity: number;
  productTotalQuantity: number;
}

export interface CartTotals {
  originalAmount: number;
  brandDiscountAmount: number;
  bestCouponDiscountAmount: number;
  finalPayableAmount: number;
}

export interface Cart {
  cartId: number;
  normalUserId: string;
  totalLines: number;
  items: CartItemResponse[];
  totals: CartTotals;
  created: boolean;
}

export interface PostCartMeRequest {
  items: {
    productId: number;
    size: string;
    color: string;
    quantity: number;
  }[];
}

export interface UpdateCartItem {
  quantity: number; 
  size?: string;
  color?: string;
}

export interface UpdateCartItemRequest extends UpdateCartItem {}