import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addCartItem, 
  type Cart, 
  type AddCartItemRequest 
} from '@/entities/cart';

interface AddToCartVariables {
  authUserId: string;
  itemData: AddCartItemRequest;
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation<Cart | null, Error, AddToCartVariables>({
    mutationFn: ({ authUserId, itemData }) => addCartItem(authUserId, itemData),
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        queryClient.setQueryData(
          ['myCart', updatedCart.normalUserId],
          updatedCart
        );
      }
    },
    onError: (error) => {
      console.error("장바구니 아이템 추가에 실패했습니다.", error);
    },
  });
};
