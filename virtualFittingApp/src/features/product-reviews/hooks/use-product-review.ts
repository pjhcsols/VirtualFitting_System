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
  
  // 💡 쿼리 키에 productId와 페이징 옵션을 포함하여 각 쿼리를 고유하게 만듭니다.
  const queryKey = [REVIEW_QUERY_KEY, productId, { page, size, ageGroup }];

  return useQuery<ReviewsResponseData>({
    queryKey: queryKey,
    queryFn: () => fetchProductReviews({ productId, page, size, ageGroup }),
    // 데이터가 변경될 가능성이 낮으므로 캐시 시간 설정 (예: 5분)
    staleTime: 5 * 60 * 1000, 
    enabled: productId > 0, // productId가 유효할 때만 쿼리 실행
  });
}