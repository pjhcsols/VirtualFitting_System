import type { OrderItem } from "./order";
import type { ReviewData } from "./review";

export type OrderItemWithReview = OrderItem & {
  isReviewed: boolean;
  reviewData?: ReviewData;
};
