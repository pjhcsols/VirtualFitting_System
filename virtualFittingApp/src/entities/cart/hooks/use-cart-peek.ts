import { useQuery } from '@tanstack/react-query';
import { peekMyCart } from '../api/cart.api';
import type { Cart } from '../model/types'; 

const cartPeekKeys = {
  count: (authUserId: string | null) => ['cart', 'peek', 'count', authUserId] as const,
};

export const useCartPeekQuery = (authUserId: string) => {


  return useQuery<Cart | null, Error, number>({ 
    queryKey: cartPeekKeys.count(authUserId),
    queryFn: async () => {
        const data = await peekMyCart(authUserId!);
        return data;
    },
    enabled: !!authUserId, 
    select: (data) => {
      return (
        data?.items?.reduce((total, item) => {
          return total + item.quantity;
        }, 0) || 0
      );
    },
    staleTime: 5000,
  });
};