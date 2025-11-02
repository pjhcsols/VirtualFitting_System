import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchProductReviews, REVIEW_QUERY_KEY } from '@/entities/review'; 
import type { ReviewsResponseData } from '@/entities/review';

interface UseProductReviewsQueryParams {
  productId: number;
  page: number;
  size: number;
  ageGroup?: number;
}

export function useProductReviewsQuery({ 
  productId, 
  page, 
  size, 
  ageGroup 
}: UseProductReviewsQueryParams): UseQueryResult<ReviewsResponseData> {
  
  const queryKey = [REVIEW_QUERY_KEY, productId, { page, size, ageGroup }];

  return useQuery<ReviewsResponseData>({
    queryKey: queryKey,
    queryFn: () => fetchProductReviews({ productId, page, size, ageGroup }),
    staleTime: 5 * 60 * 1000, 
    enabled: productId > 0,
  });
}