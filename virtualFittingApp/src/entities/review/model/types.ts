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