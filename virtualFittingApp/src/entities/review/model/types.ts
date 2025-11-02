interface ReviewOption {
  color: string;
  size: string;
  quantity: number;
}

export type ReviewData = {
    id: string;
    brand: string;
    productName: string;
    option: ReviewOption;
    rating: number;
    reviewText: string;
    photos: string[];
    date: string;
};

export type ReviewRequest = {
  purchaseSize: string;
  purchaseColor: string;
  rating: number;
  title: string;
  comment: string;
};

export interface ReviewItem {
  reviewId: number;
  maskedUserId: string;
  purchaseSize: string;
  purchaseColor: string;
  rating: number;
  title: string;
  comment: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReviews {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ReviewItem[];
  first: boolean;
  last: boolean;
  number: number;
}

export interface ReviewsResponseData {
  averageRating: number;
  reviews: PaginatedReviews;
}