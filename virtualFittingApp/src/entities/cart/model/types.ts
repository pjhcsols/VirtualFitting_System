export type CartItem = {
  id: number;
  productId: number;
  name: string;
  brand: string;
  image: string;
  price: number;
  discountedPrice?: number;
  discountRate?: number;
  color: string;
  size: string;
  quantity: number;
};

export interface ApiCartItem {
  itemId: number;
  productId: number;
  size: string;
  color: string;
  quantity: number;
  brandUserNumber: number;
  brandFirmName: string;
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
  items: ApiCartItem[];
  totals: CartTotals;
  created: boolean;
}

export interface AddCartItemRequest {
  productId: number;
  size: string;
  color: string;
  quantity: number;
  brandUserNumber: number
  brandFirmName: string;
}