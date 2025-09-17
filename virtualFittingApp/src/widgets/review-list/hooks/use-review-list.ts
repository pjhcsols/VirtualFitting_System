import { useState, useEffect } from 'react';
import type { OrderItemWithReview } from '@/entities/order'; 
import type { ReviewData } from '@/entities/review';
import { orderDummyData } from '@/entities/order'; 

export const useReviewList = () => {
  const [activeTab, setActiveTab] = useState<string>("작성가능");
  const [orders, setOrders] = useState<OrderItemWithReview[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItemWithReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = () => {
      setIsLoading(true);
      
      const dummyOrders = orderDummyData;
      const savedReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");

      const updatedOrders = dummyOrders.map(order => {
        const matchedReview = savedReviews.find((review) => review.id === order.id);
        return {
          ...order,
          isReviewed: !!matchedReview,
          reviewData: matchedReview || undefined
        };
      });

      setOrders(updatedOrders);
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === "작성가능") {
      setFilteredOrders(orders.filter((order) => !order.isReviewed));
    } else if (activeTab === "작성완료") {
      setFilteredOrders(orders.filter((order) => order.isReviewed));
    }
  }, [activeTab, orders]);

  const handleDeleteReview = (id: string) => {
    const savedReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");
    const updatedReviews = savedReviews.filter((review) => review.id !== id);
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, isReviewed: false, reviewData: undefined } : order
      )
    );
    alert("리뷰가 삭제되었습니다.");
  };

  return { 
    filteredOrders, 
    activeTab, 
    setActiveTab, 
    isLoading, 
    handleDeleteReview 
  };
};

