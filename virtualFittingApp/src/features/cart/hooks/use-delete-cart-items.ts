import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCartItems, CART_QUERY_KEY } from '@/entities/cart'; 

interface UseDeleteCartItemsParams {
  authUserId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface MutationVariables {
  itemIds: number[];
}

export function useDeleteCartItems({ authUserId, onSuccess, onError }: UseDeleteCartItemsParams) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ itemIds }: MutationVariables) =>
      deleteCartItems(authUserId, itemIds),
      
    onSuccess: (updatedCartData) => {
      if (!updatedCartData) {
        console.warn('항목 삭제 요청은 성공했으나, 서버에서 갱신된 장바구니 데이터를 받지 못했습니다. (null 반환)');
        queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, authUserId] });
        onSuccess?.();
        return; 
      }

      queryClient.setQueryData(
        [CART_QUERY_KEY, authUserId], 
        { data: updatedCartData }
      );
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, authUserId] });
      
      onSuccess?.();
    },

    onError: (error) => {
      console.error('장바구니 항목 삭제 실패:', error);
      onError?.(error as Error);
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, authUserId] });
    },
  });

  return mutation;
}
