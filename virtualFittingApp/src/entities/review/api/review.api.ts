import { apiClient } from "@/shared/api/apiClient";
import type { ReviewsResponseData } from '../model/types';

interface FetchReviewsParams {
  productId: number;
  page?: number;
  size?: number;
  sort?: string;
  ageGroup?: number;
}

export async function fetchProductReviews({
  productId,
  page = 0,
  size = 5,
  sort = "createdAt,DESC",
  ageGroup,
}: FetchReviewsParams): Promise<ReviewsResponseData | null> {
  
  const config = {
    method: 'get' as const,
    url: `/b1/products/${productId}/reviews`,
    params: {
      page,
      size,
      sort,
      ageGroup,
    },
  };
  
  const response = await apiClient<ReviewsResponseData>(config);
  
  if (response && (response.status === 200 || response.status === 0) && response.data) {
    return response.data;
  }
  console.error(`[리뷰 목록 조회] API 호출 실패:`, response);
  return null;
}