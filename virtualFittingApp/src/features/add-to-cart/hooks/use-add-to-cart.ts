import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertCart, type PostCartMeRequest, type Cart } from "@/entities/cart";
import { cartKeys } from "@/features/count-cart/cart.keys";

interface AddToCartVariables {
  accessToken: string;
  itemData: PostCartMeRequest;
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Cart | null, Error, AddToCartVariables>({
    mutationFn: ({ accessToken, itemData }) => {
      const requestBody = {
        ...itemData,
        authUserId: undefined,
      };
      return upsertCart(accessToken, requestBody);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: cartKeys.count(variables.accessToken)
      });
    },
    onError: (error) => {
      console.error("장바구니 추가에 실패했습니다.", error);
      alert("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return { addToCart: mutate, isPending };
};
