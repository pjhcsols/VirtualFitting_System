import { useQuery } from '@tanstack/react-query';
import { upsertCart } from '@/entities/cart';
import { cartKeys } from '../cart.keys';

export const useCartCountQuery = (accessToken: string | null) => {
  return useQuery({
    queryKey: cartKeys.count(accessToken),
    queryFn: async () => {
      if (!accessToken) return null;
      try {
        const cart = await upsertCart(accessToken, null);
        return cart?.items.length ?? 0;
      } catch (error) {
        console.error("장바구니 정보를 가져오는 데 실패했습니다.", error);
        return null;
      }
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, 
  });
};