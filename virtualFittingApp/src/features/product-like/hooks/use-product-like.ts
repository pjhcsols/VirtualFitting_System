import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { fetchMyLikedProductIds, toggleProductLike } from '@/entities/like';

const productLikeKeys = {
  all: ['product-likes'] as const,
  lists: (userId: string | undefined) => [...productLikeKeys.all, 'list', userId] as const,
};

export const useProductLike = (productId: number) => {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(authState);
  
  const accessToken = cookies['access-token']; 
  const authUserId = accessToken;

  const isQueryEnabled = isLoggedIn && !!authUserId && productId > 0;
  
  const { data: likedProductIdsQueryData = [], isLoading: isListLoading } = useQuery({
    queryKey: productLikeKeys.lists(authUserId),
    queryFn: () => {
      if (!authUserId) return Promise.resolve([]);
      return fetchMyLikedProductIds(authUserId);
    },
    enabled: isQueryEnabled, 
    staleTime: 1000 * 60 * 5,
  });
  
  const likedProductIds: number[] = likedProductIdsQueryData ?? [];
  const isLiked = likedProductIds.includes(productId);
  const { mutateAsync: toggleLikeMutation, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn || !authUserId) {
        alert("좋아요 기능을 사용하려면 로그인이 필요합니다.");
        navigate('/login');
        throw new Error("Login required.");
      }
      return toggleProductLike(authUserId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productLikeKeys.all });
    },
    onError: (error) => {
      console.error(`[좋아요 토글 실패] 상품 ID ${productId}:`, error);
      alert("좋아요 상태 변경에 실패했습니다.");
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