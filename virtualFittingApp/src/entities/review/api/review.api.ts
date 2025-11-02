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
}: FetchReviewsParams): Promise<ReviewsResponseData> {
  
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
  
  const result = await apiClient<ReviewsResponseData>(config, `리뷰 목록 조회: 상품ID ${productId}`);
  if (result === null) {
      throw new Error(`[리뷰 목록 조회] 데이터가 null 입니다.`);
  }

  return result;
}