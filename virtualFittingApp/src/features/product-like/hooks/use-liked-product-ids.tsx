import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { fetchMyLikedProductIds } from '@/entities/like';

const productLikeKeys = {
  all: ['product-likes'] as const,
  lists: (userId: string | null) => [...productLikeKeys.all, 'list', userId] as const,
};

export const useLikedProductIdsQuery = () => {
  const { isLoggedIn, userId } = useRecoilValue(authState);
  
  const isQueryEnabled = isLoggedIn && !!userId;
  
  const { 
    data: likedProductIdsQueryData = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: productLikeKeys.lists(userId),
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]); 
      }
      return fetchMyLikedProductIds(userId); 
    },
    enabled: isQueryEnabled, 
    staleTime: 1000 * 60 * 5,
  });
  
  const likedProductIds: number[] = likedProductIdsQueryData ?? [];

  return {
    likedProductIds,
    isLoading,
    error,
    queryKey: productLikeKeys.lists(userId), 
  };
};