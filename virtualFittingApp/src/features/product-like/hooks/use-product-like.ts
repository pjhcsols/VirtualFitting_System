import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { fetchMyLikedProductIds, toggleProductLike } from '@/entities/like';

const productLikeKeys = {
  all: ['product-likes'] as const,
  lists: (userId: string | null) => [...productLikeKeys.all, 'list', userId] as const,
};

export const useProductLike = (productId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useRecoilValue(authState);
  
  const isQueryEnabled = isLoggedIn && !!userId && productId > 0;
  
  const { data: likedProductIdsQueryData = [], isLoading: isListLoading } = useQuery({
    queryKey: productLikeKeys.lists(userId),
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchMyLikedProductIds(userId);
    },
    enabled: isQueryEnabled, 
    staleTime: 1000 * 60 * 5,
  });
  
  const likedProductIds: number[] = likedProductIdsQueryData ?? [];
  const isLiked = likedProductIds.includes(productId);
  const { mutateAsync: toggleLikeMutation, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn || !userId) {
        alert("좋아요 기능을 사용하려면 로그인이 필요합니다.");
        navigate('/login');
        throw new Error("Login required.");
      }
      return toggleProductLike(userId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productLikeKeys.all });
    },
    onError: (error) => {
      console.error(`[좋아요 토글 실패] 상품 ID ${productId}:`, error);
    },
  });

  const toggleLike = async () => {
    try {
        await toggleLikeMutation();
    } catch (e) {
    }
  };

  return {
    isLiked,
    toggleLike,
    isLoading: isListLoading || isToggling,
  };
};