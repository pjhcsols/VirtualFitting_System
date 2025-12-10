export interface OrderItem {
    id: string;
    date: string; 
    brand: string;
    productName: string;
    options: {
      color: string;
      size: string;
      quantity: number;
    };
    price: number;
    productId: number;
    productImageUrl: string;
    category: string;
  }

import type { ReviewData } from "@/entities/review/model/types";

export type OrderItemWithReview = OrderItem & {
  isReviewed: boolean;
  reviewData?: ReviewData;
  deadline?: string; // ← optional
};

export interface MyOrderItem {
  orderId: string;
  createdAt: string;
  status: string;
  brandFirmName: string;
  productName: string;
  productPhotoUrls: string[];
  productId: number;
  size: string;
  color: string;
  quantity: number;
  finalLinePayable: number;
  productTotalQuantity: number;
}

export interface OrderItemLine extends MyOrderItem {
    productPrice: number;
}

export interface OrderList {
    totalPages: number;
    totalElements: number;
    number: number;
    content: OrderItemLine[];
}
