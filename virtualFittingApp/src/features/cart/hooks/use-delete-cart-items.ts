import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCartItems, CART_QUERY_KEY } from '@/entities/cart';

interface UseDeleteCartItemsParams {
  accessToken: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteCartItems({ accessToken, onSuccess, onError }: UseDeleteCartItemsParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: number[]) => 
      deleteCartItems(accessToken, itemIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, accessToken] });
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }); 
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      }
    },
  });
}
