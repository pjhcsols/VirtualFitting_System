import type { CartItem, CartItemResponse } from '../model/types';

export const mapCartItemResponseToCartItem = (responseItem: CartItemResponse): CartItem => {
  return {
    id: responseItem.itemId,
    productId: responseItem.productId,
    name: responseItem.productName,
    brand: responseItem.brandFirmName,
    image: responseItem.productPhotoUrls?.[0] ?? '',
    price: responseItem.productPrice,
    discountedPrice: responseItem.discountedPrice,
    discountRate: responseItem.discountPercent ?? undefined,
    color: responseItem.color,
    size: responseItem.size,
    quantity: responseItem.quantity,
  };
};