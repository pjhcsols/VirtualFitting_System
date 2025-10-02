import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import type { CartItem } from './types';

const { persistAtom } = recoilPersist();

export const cartState = atom<CartItem[]>({
  key: 'cartState',
  default: [],
  effects: [persistAtom],
});

const FREE_SHIPPING_THRESHOLD = 50000;

export const cartLineItemCountState = selector<number>({
  key: 'cartLineItemCountState',
  get: ({ get }) => get(cartState).length,
});

export const cartTotalQuantityState = selector<number>({
  key: 'cartTotalQuantityState',
  get: ({ get }) => {
    return get(cartState).reduce((total, item) => total + item.quantity, 0);
  },
});

export const cartTotalsState = selector({
  key: 'cartTotalsState',
  get: ({ get }) => {
    const cartItems = get(cartState);

    const { subtotal, originalSubtotal } = cartItems.reduce(
      (acc, item) => {
        const itemPrice = item.price;
        const discountedPrice = item.discountedPrice ?? itemPrice;
        
        acc.subtotal += discountedPrice * item.quantity;
        acc.originalSubtotal += itemPrice * item.quantity;
        
        return acc;
      },
      { subtotal: 0, originalSubtotal: 0 }
    );

    const totalDiscount = originalSubtotal - subtotal;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3000;
    const total = subtotal + shippingFee;

    return {
      subtotal,
      totalDiscount,
      shippingFee,
      total,
      originalSubtotal,
    };
  },
});