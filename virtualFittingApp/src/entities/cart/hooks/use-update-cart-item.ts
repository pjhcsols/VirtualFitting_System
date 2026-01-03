import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/cart.api";
import type { Cart, UpdateCartItemRequest } from "../model/types";

interface UpdateCartItemVariables {
  accessToken: string;
  itemId: number;
  updateData: UpdateCartItemRequest;
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart | null, Error, UpdateCartItemVariables>({
    mutationFn: ({ accessToken, itemId, updateData }) => {
      return updateCartItem(accessToken, itemId, updateData);
    },
    
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        queryClient.setQueryData(['cart', 'me', updatedCart.normalUserId], updatedCart);
        queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
      }
    },
    onError: (error) => {
      console.error("장바구니 아이템 수정에 실패했습니다.", error);
    },
  });
};