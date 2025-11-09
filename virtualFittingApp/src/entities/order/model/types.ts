export interface OrderItem {
    id: string;
    date: string; 
    brand: string;
    productName: string;
    productId: number;
    options: {
      color: string;
      size: string;
      quantity: number;
    };
    price: number;
    productImageUrl: string;
    category: string;
  }

import type { ReviewData } from "@/entities/review/model/types";

export type OrderItemWithReview = OrderItem & {
  isReviewed: boolean;
  reviewData?: ReviewData;
  deadline?: string; // ← optional
};