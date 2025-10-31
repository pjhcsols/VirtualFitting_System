import type { Cart, CartItem, ApiCartItem } from '../model/types'; 

const adaptApiCartItemToViewCartItem = (apiItem: ApiCartItem): CartItem => {
  return {
    id: apiItem.itemId, 
    brand: apiItem.brandFirmName,
    
    name: `(상품이름 들어가야됨!) ${apiItem.productId}`,
    image: '', 
    price: 0, // [seah] 가격도 들어가야됌!
    
    productId: apiItem.productId,
    color: apiItem.color,
    size: apiItem.size,
    quantity: apiItem.quantity,
    discountedPrice: undefined,
    discountRate: undefined,
  };
};

export const adaptCartToViewData = (cart: Cart) => {
  return {
    ...cart,
    items: cart.items.map(adaptApiCartItemToViewCartItem),
  };
};

export type CartViewModel = ReturnType<typeof adaptCartToViewData>;