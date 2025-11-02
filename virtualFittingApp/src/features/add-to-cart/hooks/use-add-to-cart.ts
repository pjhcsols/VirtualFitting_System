import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  upsertCart, 
  type Cart, 
  type PostCartMeRequest,
} from '@/entities/cart'; 
import { cartKeys } from '@/features/conut-cart';

interface AddToCartVariables {
  authUserId: string;
  itemData: {
      productId: number;
      size: string;
      color: string;
      quantity: number;
      brandUserNumber: number;
      brandFirmName: string;
  };
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Cart | null, Error, AddToCartVariables>({
    mutationFn: ({ authUserId, itemData }) => {
        const requestBody: PostCartMeRequest = {
            items: [{
                productId: itemData.productId,
                size: itemData.size,
                color: itemData.color,
                quantity: itemData.quantity,
            }],
        };

        return upsertCart(authUserId, requestBody);
    },
    
    onSuccess: (updatedCart, variables) => {
      if (updatedCart) {
        queryClient.setQueryData(
          ['cart', 'me', updatedCart.normalUserId],
          updatedCart
        );
      }
      
      queryClient.invalidateQueries({ 
          queryKey: cartKeys.count(variables.authUserId) 
      });
    },
    onError: (error) => {
      console.error("장바구니 아이템 추가에 실패했습니다.", error);
    },
  });
};
