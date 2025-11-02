import { useMutation } from '@tanstack/react-query';
import type { Cart } from '@/entities/cart';
import { updateCartItemCoupon } from '@/entities/cart';

interface ApplyCouponVariables {
  itemId: number;
  couponWalletId: number | null;
}

interface UseApplyCartItemCouponParams {
    authUserId: string;
}

export const useApplyCartItemCoupon = ({ authUserId }: UseApplyCartItemCouponParams) => {

  return useMutation<Cart | null, Error, ApplyCouponVariables>({
    mutationFn: ({ itemId, couponWalletId }) =>
      updateCartItemCoupon(
          authUserId, 
          itemId, 
          couponWalletId
      ),
  });
};