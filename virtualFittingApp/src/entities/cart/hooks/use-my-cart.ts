import { useQuery } from '@tanstack/react-query';
import { cartKeys } from './cart.keys';
import { upsertCart } from '../api/cart.api';

export const useMyCartQuery = (accessToken: string) => {
  return useQuery({
    queryKey: cartKeys.myCart(accessToken),
    queryFn: () => {
        return upsertCart(accessToken, null);
    },
    enabled: !!accessToken,
  });
};