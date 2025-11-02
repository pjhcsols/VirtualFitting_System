import { useQuery } from '@tanstack/react-query';
import { upsertCart } from '../api/cart.api'; 
import type { Cart } from '../model/types'; 

const cartKeys = {
  all: ['cart'] as const,
  myCart: (authUserId: string) => [...cartKeys.all, 'me', authUserId] as const,
};

export const useMyCartQuery = (authUserId: string) => {
  return useQuery<Cart | null, Error, Cart | null>({ 
    queryKey: cartKeys.myCart(authUserId),
    queryFn: () => {
        return upsertCart(authUserId, null);
    },
    enabled: !!authUserId,
    staleTime: Infinity,
  });
};