import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { fetchMyLikedProductIds } from '@/entities/like';

const productLikeKeys = {
  all: ['product-likes'] as const,
  lists: (userId: string | undefined) => [...productLikeKeys.all, 'list', userId] as const,
};

export const useLikedProductIdsQuery = () => {
  const [cookies] = useCookies(['access-token']);
  const isLoggedIn = useRecoilValue(authState);
  
  const accessToken = cookies['access-token']; 
  const authUserId = accessToken;
  const isQueryEnabled = isLoggedIn && !!authUserId;
  
  const { 
    data: likedProductIdsQueryData = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: productLikeKeys.lists(authUserId),
    queryFn: () => {
      if (!authUserId) {
        return Promise.resolve([]); 
      }
      return fetchMyLikedProductIds(authUserId); 
    },
    enabled: isQueryEnabled, 
    staleTime: 1000 * 60 * 5,
  });
  
  const likedProductIds: number[] = likedProductIdsQueryData ?? [];

  return {
    likedProductIds,
    isLoading,
    error,

    queryKey: productLikeKeys.lists(authUserId), 
  };
};