import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  upsertCart, 
  type Cart, 
  type PostCartMeRequest,
} from '@/entities/cart'; 

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
    
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        queryClient.setQueryData(
          ['cart', 'me', updatedCart.normalUserId],
          updatedCart
        );
      }
    },
    onError: (error) => {
      console.error("장바구니 아이템 추가에 실패했습니다.", error);
    },
  });
};
