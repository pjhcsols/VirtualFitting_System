export type CartItem = {
  id: string;
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
