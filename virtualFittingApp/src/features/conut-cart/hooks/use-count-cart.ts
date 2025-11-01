import { useQuery } from '@tanstack/react-query';
import { upsertCart } from '@/entities/cart/api/cart.api';
import type { Cart } from '@/entities/cart/model/types'; 

const cartKeys = {
  count: (authUserId: string | null) => ['cart', 'count', authUserId] as const,
};

export const useCartCountQuery = (authUserId: string | null) => {

  return useQuery<Cart | null, Error, number>({ 
    queryKey: cartKeys.count(authUserId),
    queryFn: async () => {
        return upsertCart(authUserId!, null); 
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