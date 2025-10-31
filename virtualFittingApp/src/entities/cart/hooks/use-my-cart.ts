import { useQuery } from '@tanstack/react-query';
import { fetchMyCart,  } from '../api/cart.api';
import { adaptCartToViewData, CartViewModel } from "./adapter";
import type { Cart } from '../model/types'; 

const cartKeys = {
  all: ['cart'] as const,
  myCart: (authUserId: string) => [...cartKeys.all, 'me', authUserId] as const,
};

export const useMyCartQuery = (authUserId: string) => {
  return useQuery<Cart | null, Error, CartViewModel | null>({ 
    queryKey: ['cart', 'me', authUserId],
    queryFn: () => fetchMyCart(authUserId),
    enabled: !!authUserId,
    select: (data) => data ? adaptCartToViewData(data) : null,
  });
};