import { atom, selector } from 'recoil';
import type { CartItem } from './types';

export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: [],
});

export const cartItemCountState = selector<number>({
  key: 'cartItemCountState',
  get: ({ get }) => {
    const cartItems = get(cartState);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

export const cartTotalsState = selector({
  key: 'cartTotalsState',
  get: ({ get }) => {
    const cartItems = get(cartState);
    const shippingFee = 3000;

    const subtotal = cartItems.reduce((acc, item) => {
      const itemPrice = item.discountedPrice ?? item.price;
      return acc + itemPrice * item.quantity;
    }, 0);

    const totalDiscount = cartItems.reduce((acc, item) => {
      if (item.discountedPrice) {
        const discount = (item.price - item.discountedPrice) * item.quantity;
        return acc + discount;
      }
      return acc;
    }, 0);

    const total = subtotal + shippingFee;

    return {
      subtotal,
      totalDiscount,
      shippingFee,
      total,
      originalTotal: subtotal + totalDiscount, 
    };
  },
});