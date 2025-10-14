import { useSetRecoilState } from 'recoil';
import { cartState, type CartItem } from '@/entities/cart';

export const useAddToCart = () => {
  const setCartItems = useSetRecoilState(cartState);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity: number }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  return { addToCart };
};

